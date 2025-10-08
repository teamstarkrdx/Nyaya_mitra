import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Scale, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const LawSearch = forwardRef<{ focusSearch: () => void }>((props, ref) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      inputRef.current?.focus();
    }
  }));

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiRequest("POST", "/api/law-search", { query: query.trim() });
      const data = await res.json() as { result: string };

      if (data.result && data.result.trim().length > 0) {
        setResult(data.result);
      } else {
        setError("No results found for your query. Please try different keywords.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="law-search" className="py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Law Search Engine
          </h2>
          <p className="text-lg text-muted-foreground">
            Search through Indian Constitution, IPC, CrPC, and major Indian acts
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder='Try "IPC 420", "Article 329", "domestic violence"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 text-base"
              data-testid="input-law-search"
            />
          </div>
          <Button
            size="lg"
            onClick={handleSearch}
            disabled={isSearching}
            data-testid="button-search-law"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {result && (
          <Card className="p-6 hover-elevate transition-all overflow-visible" data-testid="search-result">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Search Result
                </h3>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-6 border-destructive/20" data-testid="search-error">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  No Results Found
                </h3>
                <p className="text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
});

LawSearch.displayName = "LawSearch";

export default LawSearch;
