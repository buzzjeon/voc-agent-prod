"""FastAPI application for VOC Agent RAG Service"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv

from app.models import (
    SearchRequest,
    SearchResult,
    GenerateRequest,
    GenerateResponse,
    HealthResponse
)
from app.rag import get_search_engine
from app.llm import get_generator

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="VOC Agent RAG Service",
    description="Hybrid search engine with FAISS + BM25 and Claude-powered guide generation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services on startup
@app.on_event("startup")
async def startup_event():
    """Initialize search engine and generator on startup"""
    print("Starting VOC Agent RAG Service...")
    try:
        # Initialize search engine (loads model and builds indices)
        engine = get_search_engine()
        print(f"Search engine ready with {engine.get_index_size()} documents")

        # Check if Claude API key is set
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            print("WARNING: ANTHROPIC_API_KEY not set. /generate endpoint will not work.")
        else:
            print("Claude API key configured")

    except Exception as e:
        print(f"Error during startup: {str(e)}")
        raise


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "VOC Agent RAG Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "search": "/search",
            "generate": "/generate",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        engine = get_search_engine()

        return HealthResponse(
            status="ok",
            embedding_model=engine.model_name,
            claude_model=os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022"),
            index_size=engine.get_index_size()
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")


@app.post("/search", response_model=List[SearchResult], tags=["Search"])
async def search_documents(request: SearchRequest):
    """
    Search documents using hybrid FAISS + BM25 search

    - **query**: Search query text
    - **top_k**: Number of results to return (default: 20, max: 100)

    Returns list of search results with relevance scores.
    """
    try:
        engine = get_search_engine()
        results = engine.hybrid_search(request.query, request.top_k)
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@app.post("/generate", response_model=GenerateResponse, tags=["Generation"])
async def generate_guide(request: GenerateRequest):
    """
    Generate troubleshooting guide using Claude API

    - **voc_title**: Title of the VOC report
    - **voc_description**: Detailed description of the problem
    - **search_results**: List of retrieved documents from search

    Returns structured guide with problem, cause, procedure, solution, and sources.
    """
    try:
        # Validate API key
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="ANTHROPIC_API_KEY not configured"
            )

        # Generate guide
        generator = get_generator()
        result = generator.generate_guide(request)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")


@app.post("/search-and-generate", response_model=GenerateResponse, tags=["Combined"])
async def search_and_generate(
    voc_title: str,
    voc_description: str,
    top_k: int = 20
):
    """
    Combined endpoint: Search documents and generate guide

    This is a convenience endpoint that performs both search and generation in one call.

    - **voc_title**: Title of the VOC report
    - **voc_description**: Detailed description of the problem
    - **top_k**: Number of documents to retrieve (default: 20)
    """
    try:
        # Step 1: Search
        engine = get_search_engine()
        search_results = engine.hybrid_search(voc_description, top_k)

        if not search_results:
            raise HTTPException(status_code=404, detail="No relevant documents found")

        # Step 2: Generate
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="ANTHROPIC_API_KEY not configured"
            )

        generator = get_generator()
        generate_request = GenerateRequest(
            voc_title=voc_title,
            voc_description=voc_description,
            search_results=search_results
        )
        result = generator.generate_guide(generate_request)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search and generate error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True
    )
