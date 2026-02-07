'use client'

import { useState, useCallback } from 'react'
import { DataSource } from '@/types/index'
import { parseCSV, parseExcel, validateData, inferColumnTypes } from '@/lib/data-parser'

export function useDataSource() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addDataSource = useCallback(async (files: FileList) => {
    setLoading(true)
    setError(null)

    try {
      const newSources: DataSource[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        let data = []

        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          data = await parseCSV(file)
        } else if (
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          file.type.includes("spreadsheet")
        ) {
          data = await parseExcel(file)
        } else {
          setError(`Format ${file.type} non supporté`)
          continue
        }

        const validation = validateData(data)
        if (!validation.valid) {
          setError(validation.errors.join("; "))
          continue
        }

        const columns = Object.keys(data[0] || {})
        const source: DataSource = {
          id: `source-${Date.now()}-${i}`,
          name: file.name,
          type: file.name.endsWith(".csv") ? "csv" : "excel",
          data,
          columns,
          uploadedAt: new Date(),
        }

        newSources.push(source)
      }

      setDataSources(prev => [...prev, ...newSources])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement du fichier")
    } finally {
      setLoading(false)
    }
  }, [])

  const removeDataSource = useCallback((id: string) => {
    setDataSources(prev => prev.filter(source => source.id !== id))
  }, [])

  const clearAllSources = useCallback(() => {
    setDataSources([])
  }, [])

  return {
    dataSources,
    loading,
    error,
    addDataSource,
    removeDataSource,
    clearAllSources,
  }
}
