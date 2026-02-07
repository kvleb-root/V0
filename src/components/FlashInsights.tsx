'use client'

import React, { useEffect, useState } from 'react'
import { DataPoint } from '@/types/index'
import { FlashInsight, generateFlashInsights } from '@/lib/flash-insights'
import { AlertTriangle, TrendingUp, ShoppingCart, Calendar, AlertCircle, X } from 'lucide-react'

interface FlashInsightsProps {
  data?: DataPoint[]
}

export function FlashInsights({ data = [] }: FlashInsightsProps) {
  const [insights, setInsights] = useState<FlashInsight[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    if (data.length > 0) {
      const generated = generateFlashInsights(data)
      setInsights(generated)
      setDismissedIds(new Set())
    }
  }, [data])

  const visibleInsights = insights.filter(
    insight =>
      !dismissedIds.has(insight.id) &&
      (filter === 'all' || insight.priority === filter)
  )

  if (data.length === 0 || visibleInsights.length === 0) {
    return null
  }

  const highPriority = visibleInsights.filter(i => i.priority === 'high')
  const mediumPriority = visibleInsights.filter(i => i.priority === 'medium')
  const lowPriority = visibleInsights.filter(i => i.priority === 'low')

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-dark-700 bg-dark-900/50 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Flash Insights
          </h3>
          <span className="text-xs bg-dark-700 text-slate-300 px-2 py-1 rounded-full">
            {visibleInsights.length} alertes
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map(priority => (
            <button
              key={priority}
              onClick={() => setFilter(priority)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                filter === priority
                  ? 'bg-blue-600 text-white'
                  : 'bg-dark-700 text-slate-400 hover:bg-dark-600'
              }`}
            >
              {priority === 'all' ? 'Toutes' : priority === 'high' ? '🔴 Critique' : priority === 'medium' ? '🟡 Moyen' : '🟢 Faible'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* High Priority */}
        {highPriority.length > 0 && (
          <div className="border-b border-dark-700 p-4">
            <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertes Critiques ({highPriority.length})
            </h4>
            <div className="space-y-2">
              {highPriority.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={() => setDismissedIds(prev => new Set([...prev, insight.id]))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority */}
        {mediumPriority.length > 0 && (
          <div className="border-b border-dark-700 p-4">
            <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Observations ({mediumPriority.length})
            </h4>
            <div className="space-y-2">
              {mediumPriority.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={() => setDismissedIds(prev => new Set([...prev, insight.id]))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Low Priority */}
        {lowPriority.length > 0 && (
          <div className="p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informations ({lowPriority.length})
            </h4>
            <div className="space-y-2">
              {lowPriority.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={() => setDismissedIds(prev => new Set([...prev, insight.id]))}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-dark-700 bg-dark-900/50 px-6 py-3 text-xs text-slate-500">
        Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
      </div>
    </div>
  )
}

interface InsightCardProps {
  insight: FlashInsight
  onDismiss: () => void
}

function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/50 bg-red-500/10'
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/10'
      case 'low':
        return 'border-green-500/50 bg-green-500/10'
      default:
        return 'border-blue-500/50 bg-blue-500/10'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'sales':
        return <TrendingUp className="h-4 w-4 text-blue-400" />
      case 'new_record':
        return <ShoppingCart className="h-4 w-4 text-green-400" />
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-purple-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className={`p-3 rounded-lg border-l-4 ${getPriorityColor(insight.priority)} flex items-start justify-between group hover:bg-opacity-20 transition-all`}>
      <div className="flex gap-3 flex-1">
        <div className="mt-0.5">{getIcon(insight.type)}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-100">{insight.title}</p>
          <p className="text-xs text-slate-400 mt-1">{insight.message}</p>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(insight.timestamp).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="ml-2 p-1 rounded hover:bg-dark-700 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Fermer cette alerte"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Icon component
function Zap({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )
}
