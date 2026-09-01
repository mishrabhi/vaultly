import asyncio

from app.db import AsyncSessionLocal
from app.services.search_service import search_similar_chunks


async def main():
    query = "What does the guide say about multi-tenancy isolation?"

    async with AsyncSessionLocal() as session:
        results = await search_similar_chunks(
            session=session,
            query=query,
        )

        print(f"Query: {query}")
        print(f"Results found: {len(results)}")

        for chunk, similarity in results:
            print("\n" + "=" * 80)
            print(f"Chunk ID: {chunk.id}")
            print(f"Document ID: {chunk.document_id}")
            print(f"Page: {chunk.page_number}")
            print(f"Chunk index: {chunk.chunk_index}")
            print(f"Similarity: {similarity:.4f}")
            print("\nContent:")
            print(chunk.content[:500])


if __name__ == "__main__":
    asyncio.run(main())