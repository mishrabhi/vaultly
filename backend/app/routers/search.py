from fastapi import APIRouter, Depends

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Document
from app.db import get_db
from app.schemas import (
    AskRequest,
    AskResponse,
    SearchRequest,
    SearchResponse,
    SearchResult,
    Source,
)
from app.services.search_service import search_similar_chunks
from app.services.context_service import build_context
from app.services.llm_service import generate_answer


router = APIRouter(
    tags=["Search"],
)


@router.post(
    "/search",
    response_model=SearchResponse,
)
async def search(
    request: SearchRequest,
    session: AsyncSession = Depends(get_db),
):
    results = await search_similar_chunks(
        session=session,
        query=request.query,
    )

    formatted_results = [
        SearchResult(
            chunk_id=chunk.id,
            document_id=chunk.document_id,
            page_number=chunk.page_number,
            chunk_index=chunk.chunk_index,
            similarity=float(similarity),
            content=chunk.content,
        )
        for chunk, similarity in results
    ]

    return SearchResponse(
        query=request.query,
        results=formatted_results,
    )


@router.post(
    "/ask",
    response_model=AskResponse,
)
async def ask(
    request: AskRequest,
    session: AsyncSession = Depends(get_db),
):
    # 1. Retrieve relevant chunks
    results = await search_similar_chunks(
        session=session,
        query=request.query,
    )

    # 2. Build context for the LLM
    context = build_context(results)

    # 3. Generate the answer
    answer = await generate_answer(
        query=request.query,
        context=context,
    )

    # 4. Collect the unique document IDs
    document_ids = {
        chunk.document_id
        for chunk, _ in results
    }

    # 5. Fetch all required documents in ONE database query
    document_result = await session.execute(
        select(Document).where(
            Document.id.in_(document_ids)
        )
    )

    # 6. Create a lookup dictionary:
    #    document_id -> Document object
    documents = {
        document.id: document
        for document in document_result.scalars().all()
    }

    # 7. Build clean source metadata
    sources = []

    for chunk, similarity in results:
        document = documents[chunk.document_id]

        sources.append(
            Source(
                document_id=document.id,
                title=document.title,
                filename=document.filename,
                page_number=chunk.page_number,
                chunk_id=chunk.id,
                similarity=float(similarity),
            )
        )

    # 8. Return the final RAG response
    return AskResponse(
        query=request.query,
        answer=answer,
        sources=sources,
    )