from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import settings
from app.models import Chunk
from app.services.embedding_service import generate_embedding


async def search_similar_chunks(
    session: AsyncSession,
    query: str,
) -> list[Chunk]:
    """
    Find the most semantically similar chunks for a query.
    """

    if not query.strip():
        raise ValueError("Query cannot be empty.")

    # 1. Convert the user's question into a vector
    query_embedding = generate_embedding(query)

    # 2. Calculate cosine distance between the query vector
    #    and every stored chunk embedding.
    distance = Chunk.embedding.cosine_distance(
        query_embedding
    )

    # 3. Convert distance into similarity.
    #
    #    cosine distance:
    #        0 = identical
    #        larger = less similar
    #
    #    cosine similarity:
    #        1 = identical
    #        smaller = less similar
    similarity = (1 - distance).label("similarity")

    # 4. Search the database
    statement = (
        select(
            Chunk,
            similarity,
        )
        .where(
            similarity >= settings.similarity_threshold
        )
        .order_by(distance)
        .limit(settings.top_k)
    )

    result = await session.execute(statement)

    # 5. Return both the Chunk and similarity score
    return result.all()