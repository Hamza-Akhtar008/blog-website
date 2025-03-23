"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { fetchCategories } from "../services/api"; // Import API function

// Function to capitalize first letter of each word
const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Sort categories: "Top" first, "Other" last, rest in between alphabetically
const sortCategories = (categories: { name: string; _id: string }[]) => {
  return categories.sort((a, b) => {
    if (a.name.toLowerCase() === "top") return -1; // Move "Top" to the beginning
    if (b.name.toLowerCase() === "top") return 1;
    if (a.name.toLowerCase() === "other") return 1; // Move "Other" to the end
    if (b.name.toLowerCase() === "other") return -1;
    return a.name.localeCompare(b.name); // Sort remaining categories alphabetically
  });
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data?.success) {
        setCategories(sortCategories(data.data)); // Sort categories after fetching
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Top Trending Blog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={``}
                onClick={(e) => e.preventDefault()} // Prevent default navigation
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === `/category/${category.name.toLowerCase()}` ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {capitalize(category.name)}
              </Link>
            ))}
          </nav>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-64 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <ModeToggle />
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container-custom py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.name.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === `/category/${category.name.toLowerCase()}` ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {capitalize(category.name)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
