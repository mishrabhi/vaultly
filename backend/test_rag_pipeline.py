import asyncio

from app.db import AsyncSessionLocal
from app.services.context_service import build_context
from app.services.search_service import search_similar_chunks


async def main():
    query = "What does the guide say about multi-tenancy isolation?"

    async with AsyncSessionLocal() as session:
        # Retrieval
        results = await search_similar_chunks(
            session=session,
            query=query,
        )

        # Context construction
        context = build_context(results)

        print("=" * 80)
        print("RAG PIPELINE TEST")
        print("=" * 80)

        print("\nQUERY:")
        print(query)

        print("\nRETRIEVED CHUNKS:")
        print(len(results))

        for chunk, similarity in results:
            print(
                f"\nChunk {chunk.id}"
                f" | Page {chunk.page_number}"
                f" | Similarity {similarity:.4f}"
            )

        print("\n" + "=" * 80)
        print("CONTEXT SENT TO LLM")
        print("=" * 80)

        print(context)


if __name__ == "__main__":
    asyncio.run(main())