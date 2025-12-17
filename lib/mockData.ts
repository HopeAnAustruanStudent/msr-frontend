import { Track, SearchResult, RetrievalAlgorithm } from '@/types'

export const MOCK_TRACKS: Track[] = [
  {
    id: '001',
    artist: 'The Beatles',
    track: 'Hey Jude',
    album: 'Hey Jude',
    genres: ['Rock', 'Pop'],
    popularity: 95,
    youtube_url: 'https://www.youtube.com/watch?v=A_MjCqQoLLA',
  },
  {
    id: '002',
    artist: 'Queen',
    track: 'Bohemian Rhapsody',
    album: 'A Night at the Opera',
    genres: ['Rock', 'Progressive Rock'],
    popularity: 98,
    youtube_url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
  },
  {
    id: '003',
    artist: 'Led Zeppelin',
    track: 'Stairway to Heaven',
    album: 'Led Zeppelin IV',
    genres: ['Rock', 'Hard Rock'],
    popularity: 96,
    youtube_url: 'https://www.youtube.com/watch?v=QkF3oxziUI4',
  },
  {
    id: '004',
    artist: 'Pink Floyd',
    track: 'Comfortably Numb',
    album: 'The Wall',
    genres: ['Progressive Rock', 'Psychedelic Rock'],
    popularity: 93,
    youtube_url: 'https://www.youtube.com/watch?v=_FrOQC-zEog',
  },
  {
    id: '005',
    artist: 'The Rolling Stones',
    track: 'Paint It Black',
    album: 'Aftermath',
    genres: ['Rock', 'Psychedelic Rock'],
    popularity: 91,
    youtube_url: 'https://www.youtube.com/watch?v=O4irXQhgMqg',
  },
  {
    id: '006',
    artist: 'David Bowie',
    track: 'Space Oddity',
    album: 'David Bowie',
    genres: ['Art Rock', 'Psychedelic Rock'],
    popularity: 89,
    youtube_url: 'https://www.youtube.com/watch?v=iYYRH4apXDo',
  },
  {
    id: '007',
    artist: 'Nirvana',
    track: 'Smells Like Teen Spirit',
    album: 'Nevermind',
    genres: ['Grunge', 'Alternative Rock'],
    popularity: 94,
    youtube_url: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
  },
  {
    id: '008',
    artist: 'Radiohead',
    track: 'Creep',
    album: 'Pablo Honey',
    genres: ['Alternative Rock', 'Grunge'],
    popularity: 88,
    youtube_url: 'https://www.youtube.com/watch?v=XFkzRNyygfk',
  },
]

export function generateMockResults(
  query: string,
  algorithm: RetrievalAlgorithm,
  k: number
): SearchResult {
  // Find query track (simple search)
  const queryTrack = MOCK_TRACKS.find(
    (t) =>
      t.track.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.album.toLowerCase().includes(query.toLowerCase())
  ) || MOCK_TRACKS[0]

  // Get random tracks (excluding query)
  const otherTracks = MOCK_TRACKS.filter((t) => t.id !== queryTrack.id)
  
  let retrievedTracks: Track[]
  
  if (algorithm === 'random') {
    // Random baseline: shuffle and take k
    retrievedTracks = [...otherTracks]
      .sort(() => Math.random() - 0.5)
      .slice(0, k)
  } else {
    // For other algorithms: prefer same genres (simulate similarity)
    const queryGenres = new Set(queryTrack.genres)
    
    const scored = otherTracks.map((track) => {
      const commonGenres = track.genres.filter((g) => queryGenres.has(g)).length
      const score = commonGenres / Math.max(queryGenres.size, track.genres.length)
      return { track, score }
    })
    
    scored.sort((a, b) => b.score - a.score)
    retrievedTracks = scored.slice(0, k).map((s) => s.track)
  }

  // Calculate mock metrics
  const relevantCount = retrievedTracks.filter((t) =>
    t.genres.some((g) => queryTrack.genres.includes(g))
  ).length

  const precision = relevantCount / k
  const recall = relevantCount / Math.max(queryTrack.genres.length, 1)
  const mrr = retrievedTracks.findIndex((t) =>
    t.genres.some((g) => queryTrack.genres.includes(g))
  ) >= 0
    ? 1 / (retrievedTracks.findIndex((t) =>
        t.genres.some((g) => queryTrack.genres.includes(g))
      ) + 1)
    : 0

  return {
    query_track: queryTrack,
    retrieved_tracks: retrievedTracks,
    algorithm,
    metrics: {
      precision_at_k: precision,
      recall_at_k: recall,
      mrr_at_k: mrr,
      ndcg_at_k: 0.5 + Math.random() * 0.4, // Mock NDCG
      coverage_at_k: k / MOCK_TRACKS.length,
      pop_at_k: retrievedTracks.reduce((sum, t) => sum + t.popularity, 0) / k,
    },
    k,
  }
}
