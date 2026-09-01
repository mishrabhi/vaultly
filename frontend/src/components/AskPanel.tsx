import { useState } from "react";
import type { FormEvent } from "react";
import { Bot, FileText, Send } from "lucide-react";
import { askQuestion } from "../services/api";
import type { AskResponse } from "../types/api";

function AskPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const result = await askQuestion({
        query: trimmedQuery,
      });

      setResponse(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate an answer.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ask-panel card">
      <div className="card-header">
        <div>
          <h2>Ask Vaultly</h2>
          <span className="muted">
            Get an answer grounded in your documents.
          </span>
        </div>

        <Bot size={20} />
      </div>

      <form className="ask-form" onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask a question about your documents..."
          rows={3}
        />

        <button type="submit" disabled={loading || !query.trim()}>
          <Send size={16} />
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {response && (
        <div className="answer">
          <div className="answer-label">Answer</div>

          <p>{response.answer}</p>

          {response.sources.length > 0 && (
            <div className="sources">
              <div className="answer-label">Sources</div>

              {response.sources.map((source) => (
                <div
                  className="source"
                  key={`${source.chunk_id}-${source.document_id}`}
                >
                  <FileText size={15} />

                  <span>
                    {source.title} · Page{" "}
                    {source.page_number ?? "—"}
                  </span>

                  <small>
                    {(source.similarity * 100).toFixed(1)}%
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AskPanel;