from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Chunk, Document
from app.services.chunk_service import chunk_text
from app.services.embedding_service import generate_embeddings
from app.services.pdf_service import extract_text_from_pdf


async def ingest_document(
    session: AsyncSession,
    title: str,
    filename: str,
    file_path: str,
) -> Document:
    """
    Extract, chunk, embed, and store a PDF document.
    """

    # 1. Extract text page-by-page
    pages = extract_text_from_pdf(file_path)

    # 2. Create the document record
    document = Document(
        title=title,
        filename=filename,
        file_path=file_path,
    )

    session.add(document)

    # We need the database-generated document ID
    # before creating Chunk rows.
    await session.flush()

    # 3. Build chunk records
    chunk_objects = []

    for page in pages:
        page_chunks = chunk_text(page["text"])

        if not page_chunks:
            continue

        # 4. Generate embeddings for this page's chunks
        embeddings = generate_embeddings(page_chunks)

        for chunk_index, (content, embedding) in enumerate(
            zip(page_chunks, embeddings)
        ):
            chunk = Chunk(
                document_id=document.id,
                content=content,
                page_number=page["page_number"],
                chunk_index=chunk_index,
                token_count=len(content.split()),
                embedding=embedding,
            )

            chunk_objects.append(chunk)

    # 5. Add all chunks to the session
    session.add_all(chunk_objects)

    # 6. Commit everything
    await session.commit()

    # 7. Refresh the document from the database
    await session.refresh(document)

    return document