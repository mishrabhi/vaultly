from app.models import Chunk


def build_context(results: list[tuple[Chunk, float]]) -> str:
    """
    Build grounded context from retrieved chunks.

    Each chunk includes its page number so the eventual
    answer can reference the source location.
    """

    context_parts = []

    for chunk, similarity in results:
        context_parts.append(
            f"[Page {chunk.page_number}]\n"
            f"{chunk.content}"
        )

    return "\n\n---\n\n".join(context_parts)