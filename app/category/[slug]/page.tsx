import { getPostsByCategory } from "@/lib/data"
import BlogCard from "@/components/blog-card"
import Sidebar from "@/components/sidebar"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return {
    title: `${categoryName} Articles`,
    description: `Browse our collection of articles about ${categoryName.toLowerCase()}.`,
    openGraph: {
      title: `${categoryName} Articles`,
      description: `Browse our collection of articles about ${categoryName.toLowerCase()}.`,
    },
    twitter: {
      card: "summary",
      title: `${categoryName} Articles`,
      description: `Browse our collection of articles about ${categoryName.toLowerCase()}.`,
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  const posts = getPostsByCategory(params.slug)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryName} Articles</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of articles about {categoryName.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">No articles found</h2>
              <p className="text-muted-foreground">
                We couldn't find any articles in this category. Please check back later.
              </p>
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

