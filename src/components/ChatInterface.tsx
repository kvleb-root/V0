'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Message as MessageType } from '@/types/index'
import { Send, Loader } from 'lucide-react'

interface ChatInterfaceProps {
  messages: MessageType[]
  loading: boolean
  onSendMessage: (message: string) => void
}

export function ChatInterface({ messages, loading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="glass flex h-full flex-col rounded-xl">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400">
                Aucun message pour le moment. Commencez à poser des questions sur vos données.
              </p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <Message key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-dark-700 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez une question sur vos données (ex: 'Top 5 des ventes par région ?')..."
            disabled={loading}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="button-primary"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

interface MessageProps {
  message: MessageType
}

function Message({ message }: MessageProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`rounded-lg px-4 py-3 max-w-xs ${
          message.type === 'user'
            ? 'bg-blue-600 text-white'
            : 'glass'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        {message.results && (
          <div className="mt-2 border-t border-slate-400/20 pt-2">
            <p className="text-xs text-slate-300">
              ✓ {message.results.rowCount} résultat(s) trouvé(s)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
