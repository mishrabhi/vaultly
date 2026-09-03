import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  Bot,
  ChevronDown,
  FileText,
  Filter,
  Home,
  Info,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { askQuestion } from "./services/api";
import type { AskResponse } from "./types/api";
import DocumentList from "./components/DocumentList";
import DocumentUpload from "./components/DocumentUpload";
import { getDocuments, searchDocuments } from "./services/api";
import type { Document, SearchResponse, SearchResult } from "./types/api";

/* =========================================================
   Navigation
   ========================================================= */

const navigation = [
  { label: "Home", to: "/", icon: Home },
  { label: "Documents", to: "/admin", icon: FileText },
  { label: "Search", to: "/search", icon: Search },
  { label: "Ask Vaultly", to: "/ask", icon: Bot },
];

const secondaryNavigation = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "About", to: "/about", icon: Info },
];

/* =========================================================
   App Shell
   ========================================================= */

function AppShell() {
  const location = useLocation();

  const pageTitle =
    location.pathname === "/"
      ? "Home"
      : location.pathname === "/admin"
        ? "Documents"
        : location.pathname === "/search"
          ? "Search"
          : location.pathname === "/ask"
            ? "Ask Vaultly"
            : location.pathname === "/settings"
              ? "Settings"
              : "About";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </div>

          <div className="brand-copy">
            <span className="brand-name">Vaultly</span>
            <span className="brand-subtitle">Knowledge Hub</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Workspace</span>
          <nav className="sidebar-nav">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-section sidebar-secondary">
          <nav className="sidebar-nav">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-eyebrow">Vaultly</span>
            <h1>{pageTitle}</h1>
          </div>

          <NavLink to="/settings" className="icon-button" aria-label="Settings">
            <Settings size={18} />
          </NavLink>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<DocumentsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/ask" element={<AskPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   Home
   ========================================================= */

function HomePage() {
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDocumentCount = async () => {
      try {
        const documents = await getDocuments();

        if (!cancelled) {
          setDocumentCount(documents.length);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load documents:", error);
        }
      }
    };

    void loadDocumentCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="home-page">
      <div className="home-hero">
        <div>
          <span className="eyebrow">Institution knowledge</span>

          <h2>Everything your team needs to know.</h2>

          <p>
            Search your institution&apos;s documents or ask Vaultly for grounded
            answers from your internal knowledge base.
          </p>
        </div>

        <div className="home-hero-badge">
          <ShieldCheck size={18} />
          <span>Knowledge protected</span>
        </div>
      </div>

      <div className="home-stats">
        <div className="home-stat-card">
          <div className="home-stat-icon">
            <FileText size={20} />
          </div>

          <div className="home-stat-content">
            <span>Documents</span>
            <strong>{documentCount}</strong>
            <small>Knowledge sources</small>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <Search size={20} />
          </div>

          <div className="home-stat-content">
            <span>Search</span>
            <strong>Ready</strong>
            <small>Find relevant sections</small>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <Bot size={20} />
          </div>

          <div className="home-stat-content">
            <span>Ask Vaultly</span>
            <strong>AI</strong>
            <small>Grounded answers</small>
          </div>
        </div>
      </div>

      <div className="home-main-grid">
        <div className="home-feature-card home-search-feature">
          <div className="home-feature-icon">
            <Search size={21} />
          </div>

          <div className="home-feature-content">
            <span className="section-label">Explore knowledge</span>

            <h3>Search your documents.</h3>

            <p>
              Find the most relevant sections across your uploaded institutional
              documents using semantic search.
            </p>

            <NavLink to="/search" className="home-feature-link">
              Search knowledge
              <span>→</span>
            </NavLink>
          </div>
        </div>

        <div className="home-feature-card home-ask-feature">
          <div className="home-feature-icon">
            <Bot size={21} />
          </div>

          <div className="home-feature-content">
            <span className="section-label">AI assistant</span>

            <h3>Ask Vaultly anything.</h3>

            <p>
              Ask questions in natural language and get answers grounded in your
              institution&apos;s knowledge base.
            </p>

            <NavLink to="/ask" className="home-feature-link">
              Start asking
              <span>→</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="home-trust-card">
        <div className="home-trust-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <span className="section-label">Built for trusted knowledge</span>

          <h3>Every answer stays connected to its source.</h3>

          <p>
            Vaultly is designed to make institutional knowledge searchable,
            traceable, and easier for teams to use.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Search
   ========================================================= */

type SimilarityFilter = "all" | "70" | "80" | "90";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null,
  );
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState("all");
  const [selectedSimilarity, setSelectedSimilarity] =
    useState<SimilarityFilter>("all");
  const [selectedPage, setSelectedPage] = useState("all");

  const suggestedQueries = [
    "data protection",
    "row level security",
    "tenant isolation",
    "backup and recovery",
    "compliance",
  ];

  useEffect(() => {
    let cancelled = false;

    const loadDocuments = async () => {
      try {
        const data = await getDocuments();

        if (!cancelled) {
          setDocuments(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load documents:", error);
        }
      }
    };

    void loadDocuments();

    return () => {
      cancelled = true;
    };
  }, []);

  const getDocumentTitle = (documentId: number) => {
    const document = documents.find((item) => item.id === documentId);

    return document?.title || document?.filename || `Document #${documentId}`;
  };

  const handleSearch = async (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery || searching) {
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response = await searchDocuments({
        query: trimmedQuery,
      });

      setSearchResponse(response);
    } catch (error) {
      console.error("Search failed:", error);

      setSearchResponse(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while searching.",
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    void handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResponse(null);
    setError("");
  };

  const clearFilters = () => {
    setSelectedDocumentId("all");
    setSelectedSimilarity("all");
    setSelectedPage("all");
  };

  const hasActiveFilters =
    selectedDocumentId !== "all" ||
    selectedSimilarity !== "all" ||
    selectedPage !== "all";

  const activeFilterCount = [
    selectedDocumentId !== "all",
    selectedSimilarity !== "all",
    selectedPage !== "all",
  ].filter(Boolean).length;

  /*
   * Build available page options from the current search results.
   */
  const availablePages = useMemo(() => {
    if (!searchResponse) {
      return [];
    }

    const pages = searchResponse.results
      .map((result) => result.page_number)
      .filter((page): page is number => page !== null);

    return Array.from(new Set(pages)).sort((a, b) => a - b);
  }, [searchResponse]);

  /*
   * Apply filters locally to results returned by /search.
   */
  const filteredResults = useMemo<SearchResult[]>(() => {
    if (!searchResponse) {
      return [];
    }

    return searchResponse.results.filter((result) => {
      const documentMatches =
        selectedDocumentId === "all" ||
        result.document_id === Number(selectedDocumentId);

      const minimumSimilarity =
        selectedSimilarity === "all" ? 0 : Number(selectedSimilarity) / 100;

      const similarityMatches = result.similarity >= minimumSimilarity;

      const pageMatches =
        selectedPage === "all" || result.page_number === Number(selectedPage);

      return documentMatches && similarityMatches && pageMatches;
    });
  }, [searchResponse, selectedDocumentId, selectedSimilarity, selectedPage]);

  return (
    <section className="search-page">
      <div className="search-hero">
        <span className="eyebrow">Knowledge search</span>

        <h2>Find the information you need.</h2>

        <p>
          Search across your institution&apos;s uploaded documents and jump
          directly to the most relevant sections.
        </p>
      </div>

      <div className="search-workspace">
        <div className="search-box-row">
          <div className="search-input-shell">
            <Search size={20} />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSearch();
                }
              }}
              placeholder="What do you want to find?"
              aria-label="Search documents"
            />

            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`filter-button ${
              hasActiveFilters ? "has-active-filters" : ""
            }`}
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={17} />

            <span>Filters</span>

            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}

            <ChevronDown
              size={15}
              className={`filter-chevron ${filtersOpen ? "open" : ""}`}
            />
          </button>

          <button
            type="button"
            className="primary-search-button"
            onClick={() => void handleSearch()}
            disabled={searching || !query.trim()}
          >
            <Search size={17} />
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {filtersOpen && (
          <div className="filters-panel">
            <div className="filters-panel-header">
              <div>
                <span className="filters-panel-eyebrow">Refine results</span>

                <h3>Search filters</h3>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-filters-button"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="filters-grid">
              <label className="filter-field">
                <span>Document</span>

                <select
                  value={selectedDocumentId}
                  onChange={(event) =>
                    setSelectedDocumentId(event.target.value)
                  }
                >
                  <option value="all">All documents</option>

                  {documents.map((document) => (
                    <option key={document.id} value={document.id}>
                      {document.title || document.filename}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field">
                <span>Minimum similarity</span>

                <select
                  value={selectedSimilarity}
                  onChange={(event) =>
                    setSelectedSimilarity(
                      event.target.value as SimilarityFilter,
                    )
                  }
                >
                  <option value="all">All matches</option>
                  <option value="70">70% or higher</option>
                  <option value="80">80% or higher</option>
                  <option value="90">90% or higher</option>
                </select>
              </label>

              <label className="filter-field">
                <span>Page</span>

                <select
                  value={selectedPage}
                  onChange={(event) => setSelectedPage(event.target.value)}
                  disabled={availablePages.length === 0}
                >
                  <option value="all">Any page</option>

                  {availablePages.map((page) => (
                    <option key={page} value={page}>
                      Page {page}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        <div className="suggestions-row">
          <span className="suggestions-label">Try searching</span>

          {suggestedQueries.map((suggestion) => (
            <button
              type="button"
              className="suggestion-chip"
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="search-error">
          <strong>Search failed</strong>
          <span>{error}</span>
        </div>
      )}

      {searchResponse && !searching && (
        <section className="search-results-section">
          <div className="search-results-header">
            <div>
              <span className="eyebrow">Search results</span>

              <h3>
                {filteredResults.length}{" "}
                {filteredResults.length === 1 ? "result" : "results"}
              </h3>
            </div>

            <div className="search-results-query">
              &quot;{searchResponse.query}&quot;
            </div>
          </div>

          {filteredResults.length > 0 ? (
            <div className="search-result-list">
              {filteredResults.map((result, index) => (
                <article key={result.chunk_id} className="search-result-card">
                  <div className="result-rank">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="result-document-icon">
                    <FileText size={21} />
                  </div>

                  <div className="result-content">
                    <div className="result-title-row">
                      <div className="result-title-group">
                        <h3>{getDocumentTitle(result.document_id)}</h3>

                        <span className="result-file">Document</span>
                      </div>

                      <span className="result-score">
                        {(result.similarity * 100).toFixed(0)}% match
                      </span>
                    </div>

                    <div className="result-meta">
                      {result.page_number !== null && (
                        <span>Page {result.page_number}</span>
                      )}

                      <span>Chunk {result.chunk_index + 1}</span>
                    </div>

                    <p className="result-snippet">{result.content}</p>

                    <div className="result-footer">
                      <span className="result-source-label">
                        Retrieved from knowledge base
                      </span>

                      <button
                        type="button"
                        className="result-view-button"
                        disabled
                        title="Source viewer will be added in the next step"
                      >
                        View source
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search-state filtered-empty-state">
              <div className="empty-search-icon">
                <Filter size={22} />
              </div>

              <h3>No results match your filters.</h3>

              <p>Try clearing one or more filters to see more results.</p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {!searchResponse && !searching && !error && (
        <div className="empty-search-state">
          <div className="empty-search-icon">
            <Search size={22} />
          </div>

          <h3>Search your knowledge base.</h3>

          <p>
            Enter a question or keyword above to find relevant document
            sections.
          </p>
        </div>
      )}

      {searching && (
        <div className="search-loading">
          <div className="search-loading-spinner" />
          <span>Searching your knowledge base...</span>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   Ask
   ========================================================= */

function AskPage() {
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || asking) {
      return;
    }

    try {
      setAsking(true);
      setError("");
      setResponse(null);

      const result = await askQuestion({
        query: trimmedQuery,
      });

      setResponse(result);
    } catch (err) {
      console.error("Ask Vaultly failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while asking Vaultly.",
      );
    } finally {
      setAsking(false);
    }
  };

  const clearQuestion = () => {
    setQuery("");
    setResponse(null);
    setError("");
  };

  return (
    <section className="ask-page">
      <div className="page-intro">
        <span className="eyebrow">AI assistant</span>

        <h2>Ask Vaultly.</h2>

        <p>
          Ask a question and get an answer grounded in your institution&apos;s
          uploaded documents.
        </p>
      </div>

      {/* Ask input */}
      <div className="ask-workspace">
        <div className="ask-box-row">
          <div className="ask-input-shell">
            <Bot size={20} />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleAsk();
                }
              }}
              placeholder="Ask anything about your institution..."
              aria-label="Ask Vaultly"
            />

            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={clearQuestion}
                aria-label="Clear question"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="primary-ask-button"
            onClick={() => void handleAsk()}
            disabled={asking || !query.trim()}
          >
            <Sparkles size={17} />
            {asking ? "Thinking..." : "Ask Vaultly"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="search-error">
          <strong>Unable to answer</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Answer area */}
      <section className="ask-response">
        {asking ? (
          <div className="ask-empty-state">
            <div className="empty-search-icon">
              <Sparkles size={22} />
            </div>

            <h3>Vaultly is thinking.</h3>

            <p>Searching your knowledge base for relevant information...</p>

            <div className="search-loading">
              <div className="search-loading-spinner" />
              <span>Finding relevant sources...</span>
            </div>
          </div>
        ) : response ? (
          <>
            <div className="ask-response-header">
              <div>
                <span className="eyebrow">Vaultly answer</span>

                <h3>Here&apos;s what I found.</h3>
              </div>
            </div>

            <div className="ask-answer-card">
              <p>{response.answer}</p>
            </div>

            {response.sources.length > 0 && (
              <div className="ask-sources">
                <div className="ask-sources-header">
                  <div>
                    <span className="eyebrow">Sources</span>
                    <h3>Grounded in your documents.</h3>
                  </div>

                  <span>
                    {response.sources.length} source
                    {response.sources.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="ask-source-list">
                  {response.sources.map((source) => (
                    <article key={source.chunk_id} className="ask-source-card">
                      <div className="result-document-icon">
                        <FileText size={19} />
                      </div>

                      <div className="ask-source-content">
                        <h4>{source.title}</h4>

                        <div className="result-meta">
                          {source.page_number !== null && (
                            <span>Page {source.page_number}</span>
                          )}

                          <span>
                            {(source.similarity * 100).toFixed(0)}% match
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="ask-empty-state">
            <div className="empty-search-icon">
              <Bot size={22} />
            </div>

            <h3>Ask Vaultly a question.</h3>

            <p>
              Ask about your institution&apos;s policies, documents, processes,
              or anything in your knowledge base.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}

/* =========================================================
   Documents
   ========================================================= */

function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();

      setDocuments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchInitialDocuments = async () => {
      try {
        const data = await getDocuments();

        if (!cancelled) {
          setDocuments(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load documents.");
          setLoading(false);
        }
      }
    };

    void fetchInitialDocuments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="documents-page">
        <DocumentUpload onUploaded={loadDocuments} />

        {error && <div className="global-error">{error}</div>}

        <DocumentList
          documents={documents}
          loading={loading}
          selectedDocumentId={null}
          onSelect={() => {}}
          onRefresh={loadDocuments}
        />
      </div>
    </section>
  );
}

/* =========================================================
   Settings
   ========================================================= */

function SettingsPage() {
  return (
    <section className="settings-page">
      <div className="settings-hero">
        <div>
          <span className="eyebrow">Workspace</span>

          <h2>Settings</h2>

          <p>Manage your Vaultly workspace and application preferences.</p>
        </div>

        <div className="settings-hero-icon">
          <Settings size={22} />
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-icon">
            <Sparkles size={20} />
          </div>

          <div className="settings-card-content">
            <span className="section-label">Workspace</span>

            <h3>Institution</h3>

            <p>Your current knowledge workspace and document collection.</p>

            <div className="settings-value">
              <span className="settings-status-dot" />
              Active workspace
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-icon">
            <ShieldCheck size={20} />
          </div>

          <div className="settings-card-content">
            <span className="section-label">Security</span>

            <h3>Knowledge protection</h3>

            <p>
              Vaultly keeps answers grounded in the documents available to your
              workspace.
            </p>

            <div className="settings-value">
              <span className="settings-status-dot" />
              Protected
            </div>
          </div>
        </div>

        <div className="settings-card settings-card-disabled">
          <div className="settings-card-icon">
            <Settings size={20} />
          </div>

          <div className="settings-card-content">
            <span className="section-label">Preferences</span>

            <h3>Application preferences</h3>

            <p>
              Additional workspace preferences will be available as
              Vaultly&apos;s configuration layer expands.
            </p>

            <span className="settings-coming-soon">Coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   About
   ========================================================= */

function AboutPage() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div>
          <span className="eyebrow">About Vaultly</span>

          <h2>Institution knowledge, made searchable.</h2>

          <p>
            Vaultly helps teams turn internal documents into a searchable,
            grounded knowledge system.
          </p>
        </div>

        <div className="about-hero-icon">
          <ShieldCheck size={25} />
        </div>
      </div>

      <div className="about-main-card">
        <div className="about-main-icon">
          <ShieldCheck size={23} />
        </div>

        <div className="about-main-content">
          <span className="section-label">The Vaultly approach</span>

          <h3>Grounded knowledge retrieval</h3>

          <p>
            Instead of relying on generic information, Vaultly retrieves
            relevant sections from your institution&apos;s own documents and
            uses that knowledge to support answers.
          </p>

          <p>
            This makes information easier to discover while keeping the
            underlying source material visible and traceable.
          </p>
        </div>
      </div>

      <div className="about-pillars">
        <div className="about-pillar">
          <div className="about-pillar-icon">
            <Search size={19} />
          </div>

          <div>
            <h3>Searchable</h3>
            <p>Find relevant information across your knowledge base.</p>
          </div>
        </div>

        <div className="about-pillar">
          <div className="about-pillar-icon">
            <Bot size={19} />
          </div>

          <div>
            <h3>Intelligent</h3>
            <p>Ask natural-language questions about your documents.</p>
          </div>
        </div>

        <div className="about-pillar">
          <div className="about-pillar-icon">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h3>Grounded</h3>
            <p>Keep answers connected to the underlying sources.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Root
   ========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
