"""RAG Search Engine with FAISS + BM25 Hybrid Search"""

import numpy as np
from typing import List, Dict, Tuple
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
import faiss
import os

from app.data import get_sample_documents
from app.models import SearchResult


class RAGSearchEngine:
    """Hybrid search engine combining FAISS vector search and BM25 keyword search"""

    def __init__(
        self,
        model_name: str = "intfloat/multilingual-e5-large-instruct",
        alpha: float = 0.1,
        embedding_dim: int = 1024
    ):
        """
        Initialize RAG search engine

        Args:
            model_name: Name of the sentence transformer model
            alpha: Weight for BM25 score (1-alpha for vector score)
                   alpha=0.1 means BM25 dominant as per PoC results
            embedding_dim: Dimension of embeddings
        """
        self.alpha = alpha
        self.embedding_dim = embedding_dim
        self.model_name = model_name

        # Load embedding model
        print(f"Loading embedding model: {model_name}")
        self.encoder = SentenceTransformer(model_name)

        # Load documents
        self.documents = get_sample_documents()
        self.doc_ids = [doc["doc_id"] for doc in self.documents]

        # Initialize search indices
        self._build_indices()

        print(f"RAG Search Engine initialized with {len(self.documents)} documents")
        print(f"Hybrid search alpha: {self.alpha} (BM25 weight)")

    def _build_indices(self):
        """Build FAISS index and BM25 index"""
        # Prepare texts for indexing
        texts = [f"{doc['title']} {doc['content']}" for doc in self.documents]

        # Build FAISS vector index
        print("Building FAISS index...")
        embeddings = self.encoder.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        # Create FAISS index with Inner Product (for normalized vectors = cosine similarity)
        self.faiss_index = faiss.IndexFlatIP(embeddings.shape[1])
        self.faiss_index.add(embeddings.astype('float32'))

        # Build BM25 index
        print("Building BM25 index...")
        tokenized_texts = [text.split() for text in texts]
        self.bm25 = BM25Okapi(tokenized_texts)

        print("Indices built successfully")

    def _vector_search(self, query: str, top_k: int) -> List[Tuple[int, float]]:
        """
        Perform vector search using FAISS

        Returns:
            List of (doc_index, score) tuples
        """
        query_embedding = self.encoder.encode(
            [query],
            normalize_embeddings=True
        )

        scores, indices = self.faiss_index.search(
            query_embedding.astype('float32'),
            top_k
        )

        results = [(int(idx), float(score)) for idx, score in zip(indices[0], scores[0])]
        return results

    def _bm25_search(self, query: str, top_k: int) -> List[Tuple[int, float]]:
        """
        Perform BM25 keyword search

        Returns:
            List of (doc_index, score) tuples
        """
        tokenized_query = query.split()
        scores = self.bm25.get_scores(tokenized_query)

        # Get top-k indices
        top_indices = np.argsort(scores)[::-1][:top_k]
        results = [(int(idx), float(scores[idx])) for idx in top_indices]

        return results

    def _normalize_scores(self, scores: List[float]) -> List[float]:
        """Normalize scores to [0, 1] range"""
        if not scores or max(scores) == min(scores):
            return [1.0] * len(scores)

        min_score = min(scores)
        max_score = max(scores)
        return [(s - min_score) / (max_score - min_score) for s in scores]

    def hybrid_search(self, query: str, top_k: int = 20) -> List[SearchResult]:
        """
        Perform hybrid search combining FAISS and BM25

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of SearchResult objects
        """
        # Get results from both search methods
        vector_results = self._vector_search(query, top_k=min(top_k * 2, len(self.documents)))
        bm25_results = self._bm25_search(query, top_k=min(top_k * 2, len(self.documents)))

        # Normalize scores
        vector_scores = {idx: score for idx, score in vector_results}
        bm25_scores = {idx: score for idx, score in bm25_results}

        all_indices = set(vector_scores.keys()) | set(bm25_scores.keys())

        # Normalize within each method
        if vector_scores:
            vector_vals = list(vector_scores.values())
            norm_vector = self._normalize_scores(vector_vals)
            vector_scores = {idx: norm_vector[i] for i, idx in enumerate(vector_scores.keys())}

        if bm25_scores:
            bm25_vals = list(bm25_scores.values())
            norm_bm25 = self._normalize_scores(bm25_vals)
            bm25_scores = {idx: norm_bm25[i] for i, idx in enumerate(bm25_scores.keys())}

        # Compute hybrid scores
        # alpha=0.1 means: 0.1 * BM25 + 0.9 * Vector
        # But we want BM25 dominant, so we use: alpha * BM25 + (1-alpha) * Vector
        # With alpha=0.1, this actually makes vector dominant
        # For BM25 dominant as per PoC, we should use higher weight for BM25
        # Let's interpret alpha=0.1 as "BM25 has 10x less weight" but normalize differently

        # Actually, standard formula: alpha * sparse + (1-alpha) * dense
        # alpha=0.1 means dense is dominant (0.9 weight)
        # But requirement says "BM25 지배" with alpha=0.1
        # Let's use the interpretation: final_score = (1-alpha) * BM25 + alpha * Vector
        # This gives BM25 90% weight

        hybrid_scores = {}
        for idx in all_indices:
            vec_score = vector_scores.get(idx, 0.0)
            bm25_score = bm25_scores.get(idx, 0.0)
            # BM25 dominant: (1-alpha) for BM25, alpha for vector
            hybrid_score = (1 - self.alpha) * bm25_score + self.alpha * vec_score
            hybrid_scores[idx] = hybrid_score

        # Sort by hybrid score
        sorted_results = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:top_k]

        # Convert to SearchResult objects
        search_results = []
        for idx, score in sorted_results:
            doc = self.documents[idx]
            search_results.append(
                SearchResult(
                    doc_id=doc["doc_id"],
                    title=doc["title"],
                    content=doc["content"],
                    score=float(score),
                    source=doc["source"]
                )
            )

        return search_results

    def get_index_size(self) -> int:
        """Return the number of documents in the index"""
        return len(self.documents)


# Global instance
_search_engine: RAGSearchEngine = None


def get_search_engine() -> RAGSearchEngine:
    """Get or create the global search engine instance"""
    global _search_engine
    if _search_engine is None:
        model_name = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-large-instruct")
        alpha = float(os.getenv("HYBRID_ALPHA", "0.1"))
        _search_engine = RAGSearchEngine(model_name=model_name, alpha=alpha)
    return _search_engine
