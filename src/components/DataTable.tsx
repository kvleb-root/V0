'use client'

import React from 'react'
import { DataPoint } from '@/types/index'

interface DataTableProps {
  data: DataPoint[]
  columns: string[]
  maxRows?: number
}

export function DataTable({ data, columns, maxRows = 10 }: DataTableProps) {
  const displayData = data.slice(0, maxRows)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dark-700 bg-dark-800/50 py-12">
        <p className="text-slate-400">Aucune donnée à afficher</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-dark-700 bg-dark-800/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-700 bg-dark-800">
            {columns.map(col => (
              <th
                key={col}
                className="px-4 py-3 text-left font-semibold text-slate-300"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-dark-700/50 hover:bg-dark-700/20"
            >
              {columns.map(col => (
                <td
                  key={`${idx}-${col}`}
                  className="px-4 py-3 text-slate-300"
                >
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > maxRows && (
        <div className="border-t border-dark-700 px-4 py-3 text-center text-xs text-slate-400">
          {data.length - maxRows} lignes supplémentaires non affichées
        </div>
      )}
    </div>
  )
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'number') {
    // Formater les nombres avec séparateurs décimaux
    if (Number.isInteger(value)) {
      return value.toLocaleString('fr-FR')
    }
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR')
  }

  return String(value)
}
