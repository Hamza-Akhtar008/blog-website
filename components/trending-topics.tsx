"use client"
import { useEffect, useState } from "react"
import { TrendingUp, ArrowRight } from "lucide-react"
import { fetchTrendingTopics } from "@/services/api"

// Define the TypeScript interface for a trending topic
interface TrendingTopic {
  _id: string
  keyword: string
  articleCount: number
}

// Function to capitalize each word in a string
const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase())

// Function to limit the number of words displayed
const truncateWords = (text: string, wordLimit: number) => {
  const words = text.split(" ")
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..." // Add ellipsis if truncated
    : text
}

export default function TrendingTopics() {
  const [visibleTopics, setVisibleTopics] = useState(5)
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])

  useEffect(() => {
    const getTrending = async () => {
      const data = await fetchTrendingTopics()
      console.log("TRENDING TOPICS : ",data)

      if (data) {
        setTrendingTopics(
          data
            .filter((topic: TrendingTopic) => topic.articleCount > 0) // ❌ Remove topics with 0 articles
            .map((topic: TrendingTopic) => ({
              ...topic,
              keyword: capitalizeWords(topic.keyword), // Capitalize topic names
            }))
            .sort((a, b) => b.articleCount - a.articleCount) // 🔥 Sort by article count (highest first)
        )
      }
    }
    getTrending()
  }, [])

  const showMoreTopics = () => {
    setVisibleTopics(trendingTopics.length)
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b p-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Trending Topics</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {trendingTopics.slice(0, visibleTopics).map((topic) => (
            <li key={topic._id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{truncateWords(topic.keyword, 5)}</span>
              <span className="text-xs text-muted-foreground">
                ({topic.articleCount} articles)
              </span>
            </li>
          ))}
        </ul>
        {visibleTopics < trendingTopics.length && (
          <button
            onClick={showMoreTopics}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-md border p-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Show more <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
