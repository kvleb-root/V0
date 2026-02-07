'use client'

import React, { useState, useRef } from 'react'
import { Upload, File } from 'lucide-react'
import clsx from 'clsx'

interface DragDropZoneProps {
  onFilesDrop: (files: FileList) => void
  loading?: boolean
}

export function DragDropZone({ onFilesDrop, loading = false }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFilesDrop(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesDrop(e.target.files)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        'glass relative rounded-xl border-2 border-dashed p-8 text-center transition-all',
        isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-dark-600 hover:border-dark-500'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      <div className="pointer-events-none space-y-4">
        <div className="flex justify-center">
          <Upload className={clsx(
            'h-12 w-12 transition-colors',
            isDragging ? 'text-blue-400' : 'text-slate-400'
          )} />
        </div>

        <div>
          <p className="text-lg font-semibold text-slate-100">
            {loading ? 'Chargement en cours...' : 'Glissez-déposez vos fichiers'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            ou cliquez pour sélectionner (CSV, Excel)
          </p>
        </div>

        <p className="text-xs text-slate-500">
          Formats supportés: CSV, XLSX, XLS (max 100 000 lignes)
        </p>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="pointer-events-auto absolute inset-0 rounded-xl"
        aria-label="Sélectionner les fichiers"
      />
    </div>
  )
}
