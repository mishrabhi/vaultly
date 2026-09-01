import { FileText, RefreshCw } from "lucide-react";
import type { Document } from "../types/api";

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  selectedDocumentId: number | null;
  onSelect: (documentId: number) => void;
  onRefresh: () => void;
}

function DocumentList({
  documents,
  loading,
  selectedDocumentId,
  onSelect,
  onRefresh,
}: DocumentListProps) {
  return (
    <div className="document-list">
      <div className="section-header">
        <div>
          <h2>Documents</h2>
          <span className="muted">
            {documents.length} document{documents.length === 1 ? "" : "s"}
          </span>
        </div>

        <button
          className="icon-button"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh documents"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
        </button>
      </div>

      {loading && documents.length === 0 ? (
        <div className="empty-state">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <FileText size={24} />
          <span>No documents yet.</span>
        </div>
      ) : (
        <div className="documents">
          {documents.map((document) => (
            <button
              key={document.id}
              className={`document-item ${
                selectedDocumentId === document.id ? "selected" : ""
              }`}
              onClick={() => onSelect(document.id)}
            >
              <FileText size={18} />
              <span className="document-info">
                <strong>{document.title}</strong>
                <small>{document.filename}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;