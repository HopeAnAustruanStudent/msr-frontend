'use client'

import { SearchResult } from '@/types'

interface MetricsDisplayProps {
  result: SearchResult
}

export function MetricsDisplay({ result }: MetricsDisplayProps) {
  const metrics = [
    { label: 'Precision@k', value: result.metrics.precision_at_k },
    { label: 'Recall@k', value: result.metrics.recall_at_k },
    { label: 'MRR@k', value: result.metrics.mrr_at_k },
    { label: 'nDCG@k', value: result.metrics.ndcg_at_k },
    { label: 'Coverage@k', value: result.metrics.coverage_at_k },
    { label: 'Avg Popularity', value: result.metrics.pop_at_k },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Evaluation Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metric.value.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
