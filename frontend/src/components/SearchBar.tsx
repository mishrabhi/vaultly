import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  loading: boolean;
}

function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || loading) {
      return;
    }

    await onSearch(trimmedQuery);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <Search size={19} />

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your knowledge base..."
        aria-label="Search your knowledge base"
      />

      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;