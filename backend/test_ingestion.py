import asyncio

from app.db import AsyncSessionLocal
from app.services.document_service import ingest_document


PDF_PATH = "test_files/sample-pdf.pdf"


async def main():
    async with AsyncSessionLocal() as session:
        document = await ingest_document(
            session=session,
            title="Task 9 Study Guide",
            filename="sample-pdf.pdf",
            file_path=PDF_PATH,
        )

        print("Document created successfully!")
        print(f"Document ID: {document.id}")
        print(f"Title: {document.title}")


if __name__ == "__main__":
    asyncio.run(main())