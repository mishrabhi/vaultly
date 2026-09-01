import { FileText } from "lucide-react";
import type { SearchResult } from "../types/api";

interface SearchResultsProps {
  results: SearchResult[];
}

function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state">
        <FileText size={24} />
        <span>No matching results found.</span>
      </div>
    );
  }

  return (
    <div className="results">
      {results.map((result) => (
        <article className="result-card" key={result.chunk_id}>
          <div className="result-meta">
            <span>Page {result.page_number ?? "—"}</span>
            <span>
              Similarity {(result.similarity * 100).toFixed(1)}%
            </span>
          </div>

          <p>{result.content}</p>
        </article>
      ))}
    </div>
  );
}

export default SearchResults;