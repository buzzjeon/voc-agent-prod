from pydantic import BaseModel, Field
from typing import List, Optional


class SearchRequest(BaseModel):
    """Request model for document search"""
    query: str = Field(..., description="Search query text")
    top_k: int = Field(default=20, ge=1, le=100, description="Number of results to return")


class SearchResult(BaseModel):
    """Individual search result"""
    doc_id: str = Field(..., description="Document ID")
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Document content")
    score: float = Field(..., description="Relevance score")
    source: str = Field(..., description="Document source")


class GenerateRequest(BaseModel):
    """Request model for guide generation"""
    voc_title: str = Field(..., description="VOC title")
    voc_description: str = Field(..., description="VOC detailed description")
    search_results: List[SearchResult] = Field(..., description="Retrieved documents from search")


class GenerateResponse(BaseModel):
    """Response model for generated guide"""
    problem: str = Field(..., description="Problem description")
    cause: str = Field(..., description="Root cause analysis")
    procedure: str = Field(..., description="Step-by-step procedure")
    solution: str = Field(..., description="Solution summary")
    sources: str = Field(..., description="Referenced sources")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    embedding_model: Optional[str] = None
    claude_model: Optional[str] = None
    index_size: Optional[int] = None
