'use client'

import { RetrievalAlgorithm } from '@/types'

interface AlgorithmSelectorProps {
  selected: RetrievalAlgorithm
  onChange: (algorithm: RetrievalAlgorithm) => void
  k: number
  onKChange: (k: number) => void
}

const ALGORITHMS: { value: RetrievalAlgorithm; label: string }[] = [
  { value: 'random', label: 'Random Baseline' },
  { value: 'lyrics', label: 'Lyrics-based' },
  { value: 'audio', label: 'Audio-based' },
  { value: 'video', label: 'Video-based' },
  { value: 'early_fusion', label: 'Early Fusion' },
  { value: 'late_fusion', label: 'Late Fusion' },
  { value: 'neural_network', label: 'Neural Network' },
]

export function AlgorithmSelector({
  selected,
  onChange,
  k,
  onKChange,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Retrieval Algorithm
        </label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as RetrievalAlgorithm)}
          className="px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Number of Results (k)
        </label>
        <select
          value={k}
          onChange={(e) => onKChange(Number(e.target.value))}
          className="px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
