import { searchPosts } from "@/lib/data"
import BlogCard from "@/components/blog-card"
import Sidebar from "@/components/sidebar"
import type { Metadata } from "next"

interface SearchPageProps {
  searchParams: {
    q: string
  }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || "All Articles"

  return {
    title: `Search Results for "${query}"`,
    description: `Browse articles matching your search for "${query}".`,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const posts = query ? searchPosts(query) : []

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
        {query && (
          <p className="mt-2 text-muted-foreground">
            {posts.length} {posts.length === 1 ? "article" : "articles"} found for "{query}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {query ? (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-8 text-center">
                  <h2 className="mb-2 text-xl font-semibold">No articles found</h2>
                  <p className="text-muted-foreground">
                    We couldn't find any articles matching your search. Please try different keywords.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Enter a search term</h2>
              <p className="text-muted-foreground">Please enter a search term to find relevant articles.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

