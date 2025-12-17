import { SearchQuery, SearchResult } from '@/types'
import { generateMockResults } from './mockData'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://164.90.222.13:8000'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function searchTracks(query: SearchQuery): Promise<SearchResult> {
  // Use mock data if enabled or backend fails
  if (USE_MOCK) {
    console.log('Using mock data')
    return generateMockResults(query.query, query.algorithm, query.k)
  }

  try {
    const response = await fetch(`${BACKEND_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.query,
        algorithm: query.algorithm,
        k: query.k,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend API failed, falling back to mock data:', error)
    // Fallback to mock data
    return generateMockResults(query.query, query.algorithm, query.k)
  }
}

export function getYouTubeEmbedUrl(youtubeUrl: string): string {
  // Convert YouTube URL to embed URL
  // https://www.youtube.com/watch?v=XXX -> https://www.youtube.com/embed/XXX
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : youtubeUrl
}
