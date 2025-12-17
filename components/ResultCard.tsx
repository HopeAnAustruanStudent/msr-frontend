'use client'

import { Track } from '@/types'
import { getYouTubeEmbedUrl } from '@/lib/api'
import { ExternalLink } from 'lucide-react'

interface ResultCardProps {
  track: Track
  isQuery?: boolean
}

export function ResultCard({ track, isQuery }: ResultCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {isQuery && (
        <div className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold">
          QUERY TRACK
        </div>
      )}
      
      {/* YouTube Embed */}
      <div className="aspect-video bg-gray-100">
        <iframe
          src={getYouTubeEmbedUrl(track.youtube_url)}
          title={`${track.artist} - ${track.track}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-gray-900">{track.track}</h3>
        <p className="text-gray-600 truncate">{track.artist}</p>
        <p className="text-gray-500 text-sm truncate">{track.album}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {track.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Popularity: <span className="font-semibold">{track.popularity}</span>
          </span>
          <a
            href={track.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
