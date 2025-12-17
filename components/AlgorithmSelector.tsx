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
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
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
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
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
