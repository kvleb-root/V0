'use client'

import { useState, useEffect } from 'react'
import {
  DragDropZone,
  DataTable,
  Chart,
  InsightChat,
  Anomalies,
  DataSources,
  SupabaseConfig,
  FlashInsights,
} from '@/components'
import { useDataSource } from '@/hooks/useDataSource'
import { useChat } from '@/hooks/useChat'
import { detectAllAnomalies } from '@/lib/anomaly-detection'
import { Anomaly } from '@/types/index'
import { BarChart3, Zap } from 'lucide-react'

export default function Home() {
  const { dataSources, loading: dsLoading, error, addDataSource, removeDataSource } = useDataSource()
  const { messages, loading: chatLoading, sendMessage } = useChat(dataSources)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [activeTab, setActiveTab] = useState<'data' | 'analytics' | 'alerts'>('data')

  // Détecter les anomalies quand les données changent
  useEffect(() => {
    if (dataSources.length > 0 && dataSources[0].data.length > 0) {
      const data = dataSources[0].data
      const numericFields = Object.keys(data[0] || {}).filter(
        key => typeof data[0][key] === 'number'
      )

      if (numericFields.length > 0) {
        const detected = detectAllAnomalies(data, numericFields[0])
        setAnomalies(detected)
      }
    }
  }, [dataSources])

  const hasData = dataSources.length > 0 && dataSources[0].data.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                Insight Engine
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Intelligence Engine avec narrations, alertes automatiques et analyse conversationnelle
            </p>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar - Data Ingestion */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Data Ingestion Section */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              Données
            </h2>

            <div className="space-y-6">
              {/* Drag & Drop Zone */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  IMPORTER DES FICHIERS
                </label>
                <DragDropZone
                  onFilesDrop={addDataSource}
                  loading={dsLoading}
                />
              </div>

              {/* Supabase Config */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  BASE DE DONNÉES
                </label>
                <SupabaseConfig />
              </div>

              {/* Data Sources List */}
              {dataSources.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">
                    SOURCES CHARGÉES
                  </label>
                  <DataSources
                    sources={dataSources}
                    onRemove={removeDataSource}
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {hasData ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 border-b border-dark-700">
                {(['data', 'analytics', 'alerts'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-400'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'data' && 'Données'}
                    {tab === 'analytics' && 'Analyse'}
                    {tab === 'alerts' && 'Anomalies'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Aperçu des données</h3>
                    <DataTable
                      data={dataSources[0]?.data || []}
                      columns={dataSources[0]?.columns || []}
                      maxRows={15}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Flash Insights */}
                  {dataSources.length > 0 && (
                    <FlashInsights data={dataSources[0]?.data || []} />
                  )}

                  {/* Insight Chat Interface */}
                  <div className="glass rounded-xl overflow-hidden h-[600px]">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Intelligence Engine (Conversationnel)</h3>
                    </div>
                    <InsightChat
                      dataSources={dataSources}
                      loading={chatLoading}
                      onSendMessage={sendMessage}
                    />
                  </div>

                  {/* Charts */}
                  {messages.some(m => m.results) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dataSources[0]?.data && (
                        <>
                          <Chart
                            type="bar"
                            data={dataSources[0].data.slice(0, 10)}
                            xAxis={dataSources[0].columns[0]}
                            yAxis={dataSources[0].columns[1]}
                            title="Visualisation en barres"
                          />
                          <Chart
                            type="line"
                            data={dataSources[0].data.slice(0, 10)}
                            xAxis={dataSources[0].columns[0]}
                            yAxis={dataSources[0].columns[1]}
                            title="Visualisation en lignes"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Anomalies détectées</h3>
                    <Anomalies anomalies={anomalies} />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="glass rounded-xl p-12 text-center">
              <div className="space-y-4">
                <BarChart3 className="h-16 w-16 mx-auto text-slate-400" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    Bienvenue sur Insight Engine
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Commencez en important un fichier CSV ou Excel depuis la section "Données" à gauche.
                    Découvrez des insights narratifs, des alertes automatiques et une analyse conversationnelle intelligente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-dark-700 pt-8">
        <div className="text-center text-sm text-slate-500">
          <p>Insight Engine • Intelligence artificielle | Narrations | Alertes automatiques | Conversationnel</p>
        </div>
      </footer>
    </div>
  )
}
