from sentence_transformers import SentenceTransformer

from app.db import settings


MODEL_NAME = settings.embedding_model

_model = SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """
    Generate a 384-dimensional embedding for a single piece of text.
    """

    if not text.strip():
        raise ValueError(
            "Cannot generate an embedding for empty text."
        )

    embedding = _model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple pieces of text.
    """

    if not texts:
        return []

    embeddings = _model.encode(
        texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()