'use client'

import React from 'react'
import { Anomaly } from '@/types/index'
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import clsx from 'clsx'

interface AnomaliesProps {
  anomalies: Anomaly[]
  loading?: boolean
}

export function Anomalies({ anomalies, loading = false }: AnomaliesProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-dark-700 bg-dark-800/50 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (anomalies.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dark-700 bg-dark-800/50 py-12">
        <p className="text-slate-400">✓ Aucune anomalie détectée dans vos données</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {anomalies.map(anomaly => (
        <AnomalyCard key={anomaly.id} anomaly={anomaly} />
      ))}
    </div>
  )
}

interface AnomalyCardProps {
  anomaly: Anomaly
}

function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const severityConfig = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
    medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  }

  const config = severityConfig[anomaly.severity]

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 transition-colors',
        config.bg,
        config.border
      )}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          {anomaly.type === 'drop' ? (
            <TrendingDown className={clsx('h-5 w-5', config.text)} />
          ) : anomaly.type === 'spike' ? (
            <TrendingUp className={clsx('h-5 w-5', config.text)} />
          ) : (
            <AlertTriangle className={clsx('h-5 w-5', config.text)} />
          )}
        </div>

        <div className="flex-1">
          <h4 className={clsx('font-semibold text-sm', config.text)}>
            {getAnomalyTitle(anomaly.type)}
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            {anomaly.description}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span>Métrique: <strong className="text-slate-300">{anomaly.metric}</strong></span>
            <span>Valeur: <strong className="text-slate-300">{formatValue(anomaly.value)}</strong></span>
            <span>Seuil: <strong className="text-slate-300">{formatValue(anomaly.threshold)}</strong></span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <span className={clsx(
            'inline-block px-2 py-1 rounded text-xs font-semibold',
            config.bg,
            config.text
          )}>
            {anomaly.severity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

function getAnomalyTitle(type: Anomaly['type']): string {
  switch (type) {
    case 'outlier':
      return 'Valeur aberrante détectée'
    case 'drop':
      return 'Baisse critique détectée'
    case 'spike':
      return 'Pic anormal détecté'
    default:
      return 'Anomalie détectée'
  }
}

function formatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString('fr-FR')
  }
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
}
