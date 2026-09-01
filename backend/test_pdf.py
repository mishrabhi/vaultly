from app.services.pdf_service import extract_text_from_pdf


PDF_PATH = "test_files/sample-pdf.pdf"


pages = extract_text_from_pdf(PDF_PATH)

print(f"Total pages: {len(pages)}")

for page in pages[:3]:
    print("\n--- Page", page["page_number"], "---")
    print(page["text"][:500])