'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Message as MessageType, DataSource, QueryResult } from '@/types/index'
import { Insight, generateNarrativeInsight, generateDetailedExplanation } from '@/lib/narrative-engine'
import { FlashInsight, generateFlashInsights, formatFlashInsight } from '@/lib/flash-insights'
import { Send, Loader, ChevronDown, Zap, BookOpen } from 'lucide-react'

interface InsightChatProps {
  dataSources: DataSource[]
  onSendMessage: (message: string) => Promise<QueryResult | null>
}

export function InsightChat({ dataSources, onSendMessage }: InsightChatProps) {
  const [messages, setMessages] = useState<(MessageType & { insight?: Insight; flashInsights?: FlashInsight[] })[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Générer les Flash Insights une seule fois au chargement des données
  useEffect(() => {
    if (dataSources.length > 0 && dataSources[0].data.length > 0 && messages.length === 0) {
      const flashInsights = generateFlashInsights(dataSources[0].data)
      if (flashInsights.length > 0) {
        const flashMessage = {
          id: `flash-${Date.now()}`,
          type: 'assistant' as const,
          content: formatFlashInsights(flashInsights),
          timestamp: new Date(),
          flashInsights,
        }
        setMessages([flashMessage])
      }
    }
  }, [dataSources])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      await sendMessage(input)
      setInput('')
    }
  }

  const sendMessage = async (text: string) => {
    const userMessage = {
      id: `msg-${Date.now()}`,
      type: 'user' as const,
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage as any])
    setIsLoading(true)

    try {
      const result = await onSendMessage(text)

      if (result && dataSources.length > 0) {
        // Générer l'insight narratif
        const insight = generateNarrativeInsight(text, result, dataSources[0].data)

        const assistantMessage = {
          id: `msg-${Date.now()}-response`,
          type: 'assistant' as const,
          content: insight.narrative,
          timestamp: new Date(),
          insight,
          results: result,
        }

        setMessages(prev => [...prev, assistantMessage as any])
      }
    } catch (error) {
      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        type: 'assistant' as const,
        content: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage as any])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass flex h-full flex-col rounded-xl overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto text-blue-400 mb-3" />
              <p className="text-slate-400">Posez une question pour commencer l'analyse</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <InsightMessage
              key={message.id}
              message={message}
              isExpanded={expandedMessage === message.id}
              onExpand={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-dark-700 p-4 bg-dark-950/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez une question sur vos données..."
            disabled={isLoading || dataSources.length === 0}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || dataSources.length === 0}
            className="button-primary"
          >
            {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}

interface InsightMessageProps {
  message: any
  isExpanded: boolean
  onExpand: () => void
}

function InsightMessage({ message, isExpanded, onExpand }: InsightMessageProps) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end">
        <div className="rounded-lg bg-blue-600 text-white px-4 py-3 max-w-xs">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    )
  }

  // Flash Insights message
  if (message.flashInsights && message.flashInsights.length > 0) {
    return (
      <div className="glass rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="font-semibold text-slate-100">Flash Insights</h3>
        </div>
        <div className="space-y-2">
          {message.flashInsights.slice(0, 5).map((insight: FlashInsight) => (
            <div key={insight.id} className={`p-3 rounded-lg border-l-4 ${getInsightStyle(insight.type)}`}>
              <p className="text-sm text-slate-300">{formatFlashInsight(insight)}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Regular insight message
  if (message.insight) {
    const insight = message.insight as Insight

    return (
      <div className="glass rounded-lg p-4 space-y-4">
        {/* Narrative */}
        <div>
          <p className="text-slate-100 font-semibold mb-2">{insight.narrative}</p>
          {insight.conclusion && <p className="text-slate-400 text-sm">{insight.conclusion}</p>}
        </div>

        {/* Stats */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-dark-700 text-slate-300 px-2 py-1 rounded">
            📊 {insight.stats.rowCount} résultats
          </span>
          {insight.comparison && (
            <span className="text-xs bg-dark-700 text-slate-300 px-2 py-1 rounded">
              📈 {insight.comparison.split(':')[0]}
            </span>
          )}
        </div>

        {/* SQL Query */}
        <details className="text-xs">
          <summary className="cursor-pointer text-slate-400 hover:text-slate-300">
            📝 Afficher la requête SQL
          </summary>
          <div className="mt-2 bg-dark-950 p-2 rounded border border-dark-700 font-mono text-slate-300 overflow-x-auto">
            {insight.sqlQuery}
          </div>
        </details>

        {/* Expand Button */}
        <button
          onClick={onExpand}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-3"
        >
          <BookOpen className="h-4 w-4" />
          {isExpanded ? 'Masquer' : 'Expliquer davantage'}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Detailed Explanation */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-dark-700">
            <div className="bg-dark-950/50 p-3 rounded text-xs text-slate-300 whitespace-pre-wrap">
              {generateDetailedExplanation(insight, [])}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Regular message
  return (
    <div className="glass rounded-lg p-4">
      <p className="text-slate-300 text-sm">{message.content}</p>
    </div>
  )
}

function formatFlashInsights(insights: FlashInsight[]): string {
  const lines = ['🔔 **Flash Insights (Alertes)**', '']

  const byPriority = {
    high: insights.filter(i => i.priority === 'high'),
    medium: insights.filter(i => i.priority === 'medium'),
    low: insights.filter(i => i.priority === 'low'),
  }

  if (byPriority.high.length > 0) {
    lines.push('**Alertes Critiques:**')
    byPriority.high.forEach(i => lines.push(`- ${formatFlashInsight(i)}`))
    lines.push('')
  }

  if (byPriority.medium.length > 0) {
    lines.push('**Observations Importantes:**')
    byPriority.medium.forEach(i => lines.push(`- ${formatFlashInsight(i)}`))
  }

  return lines.join('\n')
}

function getInsightStyle(type: string): string {
  const styles = {
    alert: 'border-red-500/50 bg-red-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    success: 'border-green-500/50 bg-green-500/10',
    info: 'border-blue-500/50 bg-blue-500/10',
  }
  return styles[type as keyof typeof styles] || styles.info
}
