import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blogPosts, getRelatedPosts } from "@/lib/data"
import { formatDate, generateJsonLd } from "@/lib/utils"
import BlogCard from "@/components/blog-card"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find((post) => post.id === params.id)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.id === params.id)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.id, post.category, post.tags)

  // Generate JSON-LD for the article
  const jsonLd = generateJsonLd(post)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-custom py-8">
        <article className="mx-auto max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={`/category/${post.category.toLowerCase()}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20"
              >
                {post.category}
              </Link>
              <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mb-6 text-xl text-muted-foreground">{post.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.readTime} min read</div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority
            />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-secondary/80"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

