"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, X } from "lucide-react";

export function InvoiceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        startTransition(() => {
          const params = new URLSearchParams(searchParams);
          if (searchValue.trim()) {
            params.set("search", searchValue.trim());
          } else {
            params.delete("search");
          }
          router.push(`?${params.toString()}`);
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This will trigger immediately on form submit
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by client or invoice #"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Searching..." : "Search"}
      </Button>
      {(searchValue || searchParams.get("search")) && (
        <Button type="button" variant="outline" onClick={handleClear} disabled={isPending}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </form>
  );
}