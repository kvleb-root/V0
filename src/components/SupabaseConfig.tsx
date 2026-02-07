'use client'

import React, { useState } from 'react'
import { Database } from 'lucide-react'

interface SupabaseConfigProps {
  onConnect?: (config: SupabaseConfig) => void
}

export interface SupabaseConfig {
  projectUrl: string
  apiKey: string
  table: string
}

export function SupabaseConfig({ onConnect }: SupabaseConfigProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<SupabaseConfig>({
    projectUrl: '',
    apiKey: '',
    table: '',
  })
  const [connected, setConnected] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (config.projectUrl && config.apiKey && config.table) {
      setConnected(true)
      onConnect?.(config)
      setIsOpen(false)
    }
  }

  const handleDisconnect = () => {
    setConnected(false)
    setConfig({ projectUrl: '', apiKey: '', table: '' })
  }

  return (
    <div className="space-y-3">
      {!connected ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="button-secondary w-full text-left flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Connecter Supabase
          </button>

          {isOpen && (
            <div className="glass rounded-lg p-4 space-y-3">
              <input
                type="text"
                placeholder="URL du projet Supabase"
                value={config.projectUrl}
                onChange={e => setConfig({ ...config, projectUrl: e.target.value })}
                className="input-field w-full"
              />
              <input
                type="password"
                placeholder="Clé API (anon)"
                value={config.apiKey}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                className="input-field w-full"
              />
              <input
                type="text"
                placeholder="Nom de la table"
                value={config.table}
                onChange={e => setConfig({ ...config, table: e.target.value })}
                className="input-field w-full"
              />
              <button
                onClick={handleSubmit}
                className="button-primary w-full"
              >
                Connecter
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-slate-100">
                Connecté à Supabase
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs text-slate-400 hover:text-red-400"
            >
              Déconnecter
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Table: <strong className="text-slate-300">{config.table}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
