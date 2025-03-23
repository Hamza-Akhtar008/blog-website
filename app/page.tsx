"use client"; // Mark this file as a client component

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchArticles } from "@/services/api";
import BlogCard from "@/components/blog-card";
import Sidebar from "@/components/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 articles

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchArticles();
        const uniqueArticles = removeDuplicates(data.data || []);
     
        setArticles(uniqueArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };
  
    getArticles();
  }, []);
  
  // Function to remove duplicate articles based on `title` and `link`
  const removeDuplicates = (articles) => {
    const seen = new Set();
    return articles.filter((article) => {
      const key = `${article.title}-${article.link}`; // Unique identifier
      if (seen.has(key)) {
        return false; // Duplicate, filter out
      }
      seen.add(key);
      return true; // Keep unique articles
    });
  };
  

  const latestPosts = [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const featuredPost = latestPosts[0];
  const remainingPosts = latestPosts.slice(1);

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {featuredPost && (
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Featured Article</h2>
              <BlogCard post={featuredPost} variant="featured" />
            </section>
          )}

          <section>
            <Tabs defaultValue="latest">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Articles</h2>
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                
                </TabsList>
              </div>

              {/* Latest Articles */}
              <TabsContent value="latest" className="space-y-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {remainingPosts.slice(0, visibleCount).map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </TabsContent>

              {/* Popular Articles */}
              <TabsContent value="popular" className="space-y-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {remainingPosts
                    .sort((a, b) => b.readTime - a.readTime)
                    .slice(0, visibleCount)
                    .map((post) => (
                      <BlogCard key={post._id} post={post} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Show More Button */}
            {remainingPosts.length >= visibleCount && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount(visibleCount+6)} // Show 6 more articles
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  View More Articles
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
