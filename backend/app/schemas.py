from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    id: int
    filename: str
    title: str
    file_path: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str


class SearchRequest(BaseModel):
    query: str


class SearchResult(BaseModel):
    chunk_id: int
    document_id: int
    page_number: int | None
    chunk_index: int
    similarity: float
    content: str


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]


class Source(BaseModel):
    document_id: int
    title: str
    filename: str
    page_number: int | None
    chunk_id: int
    similarity: float


class AskRequest(BaseModel):
    query: str


class AskResponse(BaseModel):
    query: str
    answer: str
    sources: list[Source]