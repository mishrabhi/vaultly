export interface Document {
  id: number;
  title: string;
  filename: string;
  file_path: string;
  uploaded_at: string;
}

export interface SearchRequest {
  query: string;
}

export interface SearchResult {
  chunk_id: number;
  document_id: number;
  page_number: number | null;
  chunk_index: number;
  similarity: number;
  content: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface AskRequest {
  query: string;
}

export interface Source {
  document_id: number;
  title: string;
  filename: string;
  page_number: number | null;
  chunk_id: number;
  similarity: number;
}

export interface AskResponse {
  query: string;
  answer: string;
  sources: Source[];
}
