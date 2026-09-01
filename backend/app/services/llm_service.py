from openai import AsyncOpenAI

from app.db import settings


client = AsyncOpenAI(
    api_key=settings.openai_api_key,
)


SYSTEM_PROMPT = """
You are Vaultly, a document question-answering assistant.

Answer the user's question using only the provided document context.

Rules:
1. Do not invent information that is not supported by the context.
2. If the context does not contain enough information to answer,
   say that the information was not found in the provided documents.
3. Be concise and directly answer the question.
4. When possible, mention the page number supporting the answer.
"""


async def generate_answer(
    query: str,
    context: str,
) -> str:
    """
    Generate a grounded answer using retrieved document context.
    """

    response = await client.responses.create(
        model=settings.llm_model,
        instructions=SYSTEM_PROMPT,
        input=f"""
Document context:

{context}

User question:

{query}
""",
    )

    return response.output_text