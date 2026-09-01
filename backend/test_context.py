import asyncio

from app.db import AsyncSessionLocal
from app.services.context_service import build_context
from app.services.search_service import search_similar_chunks


async def main():
    query = "What does the guide say about multi-tenancy isolation?"

    async with AsyncSessionLocal() as session:
        results = await search_similar_chunks(
            session=session,
            query=query,
        )

        context = build_context(results)

        print("QUERY:")
        print(query)

        print("\n" + "=" * 80)
        print("RETRIEVED CONTEXT")
        print("=" * 80)

        print(context)


if __name__ == "__main__":
    asyncio.run(main())