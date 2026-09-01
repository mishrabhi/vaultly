import asyncio

from app.services.llm_service import generate_answer


async def main():
    query = "What does the guide say about multi-tenancy isolation?"

    context = """
[Page 2]
Multi-tenancy isolation
One enterprise customer must never see another's data.
Isolation must be enforced at the database layer
(RLS/tenant keys), not merely in application code.

[Page 4]
Tenant isolation enforced only in application code,
one missing WHERE clause from a breach.
"""

    answer = await generate_answer(
        query=query,
        context=context,
    )

    print("QUESTION:")
    print(query)

    print("\n" + "=" * 80)

    print("ANSWER:")
    print(answer)


if __name__ == "__main__":
    asyncio.run(main())