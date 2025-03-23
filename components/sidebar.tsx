"use client";
import TrendingTopics from "./trending-topics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCategories } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Sort categories: "Top" first, "Other" last, rest in between alphabetically
const sortCategories = (categories: { name: string; _id: string; count: number }[]) => {
  return categories.sort((a, b) => {
    if (a.name.toLowerCase() === "top") return -1; // Move "Top" to the beginning
    if (b.name.toLowerCase() === "top") return 1;
    if (a.name.toLowerCase() === "other") return 1; // Move "Other" to the end
    if (b.name.toLowerCase() === "other") return -1;
    return a.name.localeCompare(b.name); // Sort remaining categories alphabetically
  });
};

export default function Sidebar() {
  const [categories, setCategories] = useState<{ name: string; _id: string; count: number }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      console.log("Categories: ", data);
      if (data?.success) {
        const filteredCategories = data.data
          .filter((category: any) => category.count > 0) // Remove categories with zero count
          .map((category: any) => ({
            ...category,
            name: capitalize(category.name), // Capitalize category name
          }));

        setCategories(sortCategories(filteredCategories)); // Sort categories after filtering
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <TrendingTopics />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href="" // Empty href to prevent navigation
                  onClick={(e) => e.preventDefault()} // Prevent default navigation
                  className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent cursor-not-allowed opacity-50"
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count} articles</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Subscribe</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <p className="text-sm text-muted-foreground">Get the latest articles and news delivered to your inbox.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Subscribe
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
