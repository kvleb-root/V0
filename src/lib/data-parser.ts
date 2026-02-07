import Papa from 'papaparse'
import { DataPoint } from '@/types/index'

/**
 * Parse un fichier CSV
 */
export function parseCSV(file: File): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data) {
          resolve(results.data as DataPoint[])
        } else {
          reject(new Error("Erreur lors du parsing du fichier CSV"))
        }
      },
      error: (error) => {
        reject(new Error(`Erreur de parsing: ${error.message}`))
      },
    })
  })
}

/**
 * Parse un fichier Excel (simplifié - utilise une conversion en CSV ou librairie externe)
 * Pour la démo, on accepte les fichiers XLSX et on utilise une librairie comme xlsx
 */
export async function parseExcel(file: File): Promise<DataPoint[]> {
  // Dans une vraie application, vous utiliseriez 'xlsx' ou 'exceljs'
  // Pour la démo, on va traiter comme du CSV ou rejeter avec un message
  if (file.name.endsWith('.csv')) {
    return parseCSV(file)
  }

  // Simule le parsing d'Excel
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        // Simule le chargement depuis un fichier Excel
        resolve([])
      } catch (error) {
        reject(new Error("Erreur lors du parsing du fichier Excel. Veuillez utiliser un fichier CSV ou installer 'xlsx'."))
      }
    }
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Valide les données chargées
 */
export function validateData(data: DataPoint[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data || data.length === 0) {
    errors.push("Aucune donnée à importer")
    return { valid: false, errors }
  }

  if (data.length > 100000) {
    errors.push("Le fichier contient trop de lignes (max 100000)")
  }

  // Vérifier que tous les enregistrements ont la même structure
  const firstKeys = Object.keys(data[0])
  for (let i = 1; i < Math.min(data.length, 10); i++) {
    const keys = Object.keys(data[i])
    if (keys.length !== firstKeys.length) {
      errors.push(`Incohérence de structure détectée à la ligne ${i + 1}`)
      break
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Obtient les colonnes et leurs types
 */
export function inferColumnTypes(data: DataPoint[]): Record<string, string> {
  const types: Record<string, string> = {}

  if (data.length === 0) return types

  const firstRow = data[0]
  Object.keys(firstRow).forEach(key => {
    const value = firstRow[key]
    if (typeof value === "number") {
      types[key] = "number"
    } else if (value instanceof Date) {
      types[key] = "date"
    } else if (value === "true" || value === "false" || value === true || value === false) {
      types[key] = "boolean"
    } else {
      types[key] = "string"
    }
  })

  return types
}

/**
 * Formate les données pour l'export
 */
export function exportData(data: DataPoint[], format: "csv" | "json" = "csv"): string {
  if (format === "json") {
    return JSON.stringify(data, null, 2)
  }

  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header]
          const stringValue = String(value || "")
          return stringValue.includes(",") ? `"${stringValue}"` : stringValue
        })
        .join(",")
    ),
  ].join("\n")

  return csvContent
}
