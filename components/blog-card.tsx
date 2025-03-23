"use client";
import Image from "next/image";
import Link from "next/link";
import Microlink from "@microlink/react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    link: string;
    image: string | null;
    description: string | null;
    createdAt: string;
  };
  variant?: "default" | "featured" | "compact";
}

// Helper function to determine valid image sources
const getValidImageSrc = (image: string | null): string | null => {
  if (!image) return null; // No image available, fallback to Microlink

  try {
    const url = new URL(image, "http://dummy.com"); // Ensure it's a valid URL

    // Force Microlink for Facebook images and x-raw-image URLs
    if (
      url.hostname.includes("lookaside.fbsbx.com") ||
      url.hostname.includes("graph.facebook.com") ||
      image.startsWith("x-raw-image://") // Handle x-raw-image
    ) {
      return null;
    }

    if (image.startsWith("//")) return `http:${image}`; // Fix protocol-less URLs
    return image;
  } catch (error) {
    return null; // Invalid URL, fallback to Microlink
  }
};


export default function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = getValidImageSrc(post.image);

  if (variant === "featured") {
    return (
      <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
        <Link href={post.link} className="absolute inset-0 z-10" target="_blank"></Link>

        {!imageError && imageSrc ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={post.title}
              width={600}
              height={300}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <Microlink url={post.link} />
        )}

        <div className="p-4">
          <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
          <h2 className="mb-2 text-xl font-bold leading-tight md:text-2xl">{post.title}</h2>
          {post.description && <p className="line-clamp-2 text-sm text-muted-foreground">{post.description}</p>}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="group flex gap-4 rounded-lg border bg-card p-3 transition-all hover:bg-accent/50">
        {!imageError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={post.title}
            width={80}
            height={80}
            className="object-cover rounded-md"
            onError={() => setImageError(true)}
          />
        ) : (
          <Microlink url={post.link} />
        )}

        <div className="flex flex-1 flex-col justify-center">
          <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
          <Link href={post.link} className="line-clamp-2 font-medium hover:underline" target="_blank">
            {post.title}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      {!imageError && imageSrc ? (
        <Image
          src={imageSrc}
          alt={post.title}
          width={600}
          height={300}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <Microlink size="medium" url={post.link} />
      )}

      <div className="p-4">
        <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
        <Link href={post.link} target="_blank">
          <h2 className="mb-2 line-clamp-2 text-xl font-semibold group-hover:text-primary">{post.title}</h2>
        </Link>
        {post.description && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>}
      </div>
    </div>
  );
}
