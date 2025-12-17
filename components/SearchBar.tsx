'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by artist, track, or album..."
          disabled={isLoading}
          className="w-full px-6 py-4 pr-14 text-lg text-gray-900 border-2 border-gray-300 rounded-full 
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                   placeholder:text-gray-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-200"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 
                   bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
                   text-white p-3 rounded-full
                   transition-colors duration-200
                   disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
