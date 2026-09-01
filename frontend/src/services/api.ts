import type {
  AskRequest,
  AskResponse,
  Document,
  SearchRequest,
  SearchResponse,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const body = await response.json();

      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_BASE_URL}/documents`);

  return parseResponse<Document[]>(response);
}

export async function getDocument(
  documentId: number,
): Promise<Document> {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
  );

  return parseResponse<Document>(response);
}

export async function uploadDocument(
  file: File,
): Promise<Document> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  return parseResponse<Document>(response);
}

export async function searchDocuments(
  request: SearchRequest,
): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseResponse<SearchResponse>(response);
}

export async function askQuestion(
  request: AskRequest,
): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseResponse<AskResponse>(response);
}
