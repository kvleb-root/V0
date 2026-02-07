'use client'

import React from 'react'
import { DataSource } from '@/types/index'
import { X, Database, BarChart3 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DataSourcesProps {
  sources: DataSource[]
  onRemove: (id: string) => void
}

export function DataSources({ sources, onRemove }: DataSourcesProps) {
  if (sources.length === 0) {
    return (
      <div className="rounded-lg border border-dark-700 bg-dark-800/50 p-6 text-center">
        <Database className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <p className="text-slate-400">Aucune source de données chargée</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sources.map(source => (
        <div
          key={source.id}
          className="glass rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <h4 className="font-semibold text-slate-100 truncate">{source.name}</h4>
            </div>
            <p className="text-xs text-slate-400">
              {source.data.length.toLocaleString('fr-FR')} lignes • {source.columns.length} colonnes
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Importé {formatDistanceToNow(source.uploadedAt, {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>

          <button
            onClick={() => onRemove(source.id)}
            className="button-secondary ml-4 flex-shrink-0 p-2 hover:bg-red-500/10"
            title="Supprimer cette source"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
