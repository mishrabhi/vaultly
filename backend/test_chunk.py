from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import chunk_text


PDF_PATH = "test_files/sample-pdf.pdf"


pages = extract_text_from_pdf(PDF_PATH)

total_chunks = 0

for page in pages:
    chunks = chunk_text(page["text"])

    print(
        f"\nPage {page['page_number']}: "
        f"{len(chunks)} chunks"
    )

    for index, chunk in enumerate(chunks):
        print(
            f"\n  Chunk {index}"
            f" ({len(chunk)} chars)"
        )
        print(f"  {chunk[:200]}")

    total_chunks += len(chunks)


print(f"\nTotal chunks: {total_chunks}")