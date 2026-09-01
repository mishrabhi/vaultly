import { useEffect, useState } from "react";

import "./App.css";

import AskPanel from "./components/AskPanel";
import DocumentList from "./components/DocumentList";
import DocumentUpload from "./components/DocumentUpload";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

import {
  getDocuments,
  searchDocuments,
} from "./services/api";

import type {
  Document,
  SearchResult,
} from "./types/api";


function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    loadDocuments();
  }, []);


  async function loadDocuments() {
    try {
      setLoadingDocuments(true);
      setError(null);

      const data = await getDocuments();

      setDocuments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents.",
      );
    } finally {
      setLoadingDocuments(false);
    }
  }


  async function handleSearch(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const response = await searchDocuments({
        query,
      });

      setSearchResults(response.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Search failed.",
      );
    } finally {
      setSearching(false);
    }
  }


  function handleUploaded(document: Document) {
    setDocuments((current) => [
      document,
      ...current,
    ]);
  }


  function handleSelect(documentId: number) {
    setSelectedDocumentId(documentId);
  }


  return (
    <main className="app">
      <section className="app-shell">

        <header className="hero">
          <p className="eyebrow">
            VAULTLY
          </p>

          <h1>
            Your institution's knowledge,
            <br />
            searchable.
          </h1>

          <p className="hero-description">
            Upload documents, search their contents semantically,
            and ask questions using your knowledge base.
          </p>
        </header>


        <section className="search-section">

          <SearchBar
            onSearch={handleSearch}
            loading={searching}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {searching && (
            <p className="status-message">
              Searching your knowledge base...
            </p>
          )}

          {!searching && searchResults.length > 0 && (
            <SearchResults
              results={searchResults}
            />
          )}

        </section>


        <section className="documents-section">

          <div className="section-header">
            <div>
              <p className="section-eyebrow">
                KNOWLEDGE BASE
              </p>

              <h2>
                Documents
              </h2>
            </div>

            <DocumentUpload
              onUploaded={handleUploaded}
            />
          </div>


          <DocumentList
            documents={documents}
            loading={loadingDocuments}
            selectedDocumentId={selectedDocumentId}
            onSelect={handleSelect}
            onRefresh={loadDocuments}
          />

        </section>


        <section className="ask-section">

          <div className="section-header">
            <div>
              <p className="section-eyebrow">
                RAG ASSISTANT
              </p>

              <h2>
                Ask your knowledge base
              </h2>
            </div>
          </div>

          <AskPanel />

        </section>

      </section>
    </main>
  );
}


export default App;
