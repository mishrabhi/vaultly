from app.services.embedding_service import generate_embedding


text = """
Multi-tenancy isolation means one enterprise customer
must never see another customer's data.
"""


embedding = generate_embedding(text)


print(f"Embedding dimensions: {len(embedding)}")
print(f"First 10 values: {embedding[:10]}")