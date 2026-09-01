from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import DocumentResponse

from app.db import get_db
from app.models import Document
from app.services.document_service import ingest_document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


UPLOAD_DIR = Path("uploads")


@router.post(
    "/upload",
    response_model=DocumentResponse,
)
async def upload_document(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
):
    # 1. Validate filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided.",
        )

    # 2. Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    # 3. Create upload directory
    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # 4. Generate unique stored filename
    stored_filename = f"{uuid4()}_{file.filename}"
    file_path = UPLOAD_DIR / stored_filename

    # 5. Save uploaded PDF
    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    file_path.write_bytes(contents)

    # 6. Ingest document
    try:
        document = await ingest_document(
            session=session,
            title=Path(file.filename).stem,
            filename=file.filename,
            file_path=str(file_path),
        )

    except Exception:
        if file_path.exists():
            file_path.unlink()

        raise

    # 7. Return document information
    return {
        "id": document.id,
        "title": document.title,
        "filename": document.filename,
        "file_path": document.file_path,
        "uploaded_at": document.uploaded_at,
    }


@router.get(
    "",
    response_model=list[DocumentResponse],
)
async def list_documents(
    session: AsyncSession = Depends(get_db),
):
    """
    Return all uploaded documents.
    """

    result = await session.execute(
        select(Document)
        .order_by(Document.uploaded_at.desc())
    )

    documents = result.scalars().all()

    return [
        {
            "id": document.id,
            "title": document.title,
            "filename": document.filename,
            "file_path": document.file_path,
            "uploaded_at": document.uploaded_at,
        }
        for document in documents
    ]


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
async def get_document(
    document_id: int,
    session: AsyncSession = Depends(get_db),
):
    """
    Return a single document by ID.
    """

    result = await session.execute(
        select(Document).where(
            Document.id == document_id
        )
    )

    document = result.scalar_one_or_none()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return {
        "id": document.id,
        "title": document.title,
        "filename": document.filename,
        "file_path": document.file_path,
        "uploaded_at": document.uploaded_at,
    }