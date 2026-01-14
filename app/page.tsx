'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { AlgorithmSelector } from '@/components/AlgorithmSelector'
import { MetricsDisplay } from '@/components/MetricsDisplay'
import { ResultCard } from '@/components/ResultCard'
import { searchTracks } from '@/lib/api'
import { RetrievalAlgorithm, SearchResult } from '@/types'
import { Music, Columns, Square } from 'lucide-react'

const ALGORITHM_LABELS: Record<RetrievalAlgorithm, string> = {
  random: 'Random Baseline',
  lyrics: 'Lyrics-based',
  audio: 'Audio-based',
  video: 'Video-based',
  early_fusion: 'Early Fusion',
  late_fusion: 'Late Fusion',
  neural_network: 'Neural Network',
}

export default function HomePage() {
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [algorithm1, setAlgorithm1] = useState<RetrievalAlgorithm>('lyrics')
  const [algorithm2, setAlgorithm2] = useState<RetrievalAlgorithm>('random')
  const [k, setK] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [result1, setResult1] = useState<SearchResult | null>(null)
  const [result2, setResult2] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    setIsLoading(true)
    setError(null)
    setLastQuery(trimmedQuery)

    try {
      if (isComparisonMode) {
        const [res1, res2] = await Promise.all([
          searchTracks({ query: trimmedQuery, algorithm: algorithm1, k }),
          searchTracks({ query: trimmedQuery, algorithm: algorithm2, k }),
        ])
        setResult1(res1)
        setResult2(res2)
      } else {
        const res = await searchTracks({ query: trimmedQuery, algorithm: algorithm1, k })
        setResult1(res)
        setResult2(null)
      }
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const ResultsList = ({ result, title }: { result: SearchResult; title?: string }) => (
    <div className="w-full space-y-8">
      {/* Metrics */}
      {result.metrics && <MetricsDisplay result={result} />}

      {/* Query Track */}
      {result.query_track && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Query Track</h2>
          <ResultCard track={result.query_track} isQuery />
        </div>
      )}

      {/* Retrieved Tracks */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {title || `Retrieved Tracks (${result.retrieved_tracks.length})`}
        </h2>
        <div className={`grid grid-cols-1 ${isComparisonMode ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {result.retrieved_tracks.map((track) => (
            <ResultCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  )

  const toggleComparisonMode = async () => {
    const newMode = !isComparisonMode
    setIsComparisonMode(newMode)
    
    // If we're turning on comparison mode and have a search query but no second result
    if (newMode && lastQuery && !result2) {
      setIsLoading(true)
      try {
        const res2 = await searchTracks({ query: lastQuery, algorithm: algorithm2, k })
        setResult2(res2)
      } catch (err) {
        console.error('Failed to load second algorithm results:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          
          <button
            onClick={toggleComparisonMode}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            {isComparisonMode ? (
              <><Square className="w-4 h-4" /> Single View</>
            ) : (
              <><Columns className="w-4 h-4" /> Comparison Mode</>
            )}
          </button>
        </div>
      </header>

      {/* Search Section */}
      <main className={`${isComparisonMode ? 'max-w-400' : 'max-w-7xl'} mx-auto px-4 py-12`}>
        <div className="flex flex-col items-center gap-8">
          {/* Big Search Bar */}
          <div className="w-full flex flex-col items-center gap-6">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            
            <div className={`flex flex-wrap gap-8 justify-center items-end ${isComparisonMode ? 'w-full' : ''}`}>
              <div className={isComparisonMode ? 'flex-1 min-w-75' : ''}>
                {isComparisonMode && <p className="text-xs font-bold text-blue-600 uppercase mb-1">Algorithm 1</p>}
                <AlgorithmSelector
                  selected={algorithm1}
                  onChange={setAlgorithm1}
                  k={k}
                  onKChange={setK}
                />
              </div>
              
              {isComparisonMode && (
                <div className="flex-1 min-w-75">
                  <p className="text-xs font-bold text-purple-600 uppercase mb-1">Algorithm 2</p>
                  <AlgorithmSelector
                    selected={algorithm2}
                    onChange={setAlgorithm2}
                    k={k}
                    onKChange={setK} // Same k for both
                  />
                </div>
              )}
            </div>
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
          {(result1 || result2) && !isLoading && (
            <div className={`w-full ${isComparisonMode ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : ''}`}>
              {result1 && (
                <div className="space-y-6">
                  {isComparisonMode && (
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg font-bold">
                      {ALGORITHM_LABELS[algorithm1]} Results
                    </div>
                  )}
                  <ResultsList result={result1} />
                </div>
              )}

              {isComparisonMode && (
                <div className="space-y-6">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-t-lg font-bold">
                    {ALGORITHM_LABELS[algorithm2]} Results
                  </div>
                  {result2 ? (
                    <ResultsList result={result2} />
                  ) : (
                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                      Perform a search to see {ALGORITHM_LABELS[algorithm2]} results
                    </div>
                  )}
                </div>
              )}
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
            Multimedia Search and Retrieval - 2025/2026
          </p>
        </div>
      </footer>
    </div>
  )
}
