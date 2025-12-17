'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { AlgorithmSelector } from '@/components/AlgorithmSelector'
import { MetricsDisplay } from '@/components/MetricsDisplay'
import { ResultCard } from '@/components/ResultCard'
import { searchTracks } from '@/lib/api'
import { RetrievalAlgorithm, SearchResult } from '@/types'
import { Music } from 'lucide-react'

export default function HomePage() {
  const [algorithm, setAlgorithm] = useState<RetrievalAlgorithm>('lyrics')
  const [k, setK] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchResult = await searchTracks({ query, algorithm, k })
      setResult(searchResult)
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Music Retrieval System
              </h1>
              <p className="text-sm text-gray-600">
                JKU Multimedia Search and Retrieval - MMSR25
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Big Search Bar */}
          <div className="w-full flex flex-col items-center gap-6">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <AlgorithmSelector
              selected={algorithm}
              onChange={setAlgorithm}
              k={k}
              onKChange={setK}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="w-full space-y-8">
              {/* Metrics */}
              <MetricsDisplay result={result} />

              {/* Query Track */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Query Track</h2>
                <ResultCard track={result.query_track} isQuery />
              </div>

              {/* Retrieved Tracks */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Retrieved Tracks ({result.retrieved_tracks.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.retrieved_tracks.map((track) => (
                    <ResultCard key={track.id} track={track} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Institute of Computational Perception - JKU Linz
          </p>
          <p className="mt-1">
            Lightning Talk Demo - December 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
