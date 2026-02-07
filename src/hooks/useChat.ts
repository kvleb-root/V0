'use client'

import { useState, useCallback } from 'react'
import { Message, DataSource, QueryResult } from '@/types/index'
import {
  parseNaturalLanguageQuery,
  executeQuery,
  generateResponse,
} from '@/lib/sql-engine'

export function useChat(dataSources: DataSource[]) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "user",
        content,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMessage])
      setLoading(true)

      try {
        // Obtenir les données de la première source disponible
        const dataSource = dataSources[0]
        if (!dataSource) {
          const errorMessage: Message = {
            id: `msg-${Date.now()}-error`,
            type: "assistant",
            content: "Aucune source de données n'a été chargée. Veuillez importer des données d'abord.",
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, errorMessage])
          return
        }

        // Parser la question en français
        const parsedQuery = parseNaturalLanguageQuery(content)
        
        // Exécuter la requête
        const results = executeQuery(
          dataSource.data,
          parsedQuery.operation,
          parsedQuery.field,
          parsedQuery.limit
        )

        // Générer une réponse
        const responseText = generateResponse(parsedQuery.operation, results)

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-response`,
          type: "assistant",
          content: responseText,
          query: content,
          results,
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, assistantMessage])
      } catch (error) {
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          type: "assistant",
          content: `Erreur lors du traitement de la requête: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setLoading(false)
      }
    },
    [dataSources]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  }
}
