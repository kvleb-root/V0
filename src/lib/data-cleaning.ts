import { DataPoint } from '@/types/index'

export interface CleaningStats {
  originalCount: number
  finalCount: number
  duplicatesRemoved: number
  nullsHandled: number
  typesFixed: number
}

/**
 * Nettoie automatiquement les données
 */
export function cleanData(data: DataPoint[]): { cleanedData: DataPoint[]; stats: CleaningStats } {
  const stats: CleaningStats = {
    originalCount: data.length,
    duplicatesRemoved: 0,
    nullsHandled: 0,
    typesFixed: 0,
    finalCount: 0,
  }

  let cleaned = [...data]

  // Étape 1: Supprimer les doublons exact
  cleaned = removeDuplicates(cleaned, stats)

  // Étape 2: Gérer les valeurs nulles
  cleaned = handleNulls(cleaned, stats)

  // Étape 3: Corriger les types de données
  cleaned = fixDataTypes(cleaned, stats)

  // Étape 4: Supprimer les lignes complètement vides
  cleaned = cleaned.filter(row => Object.values(row).some(val => val !== null && val !== undefined && val !== ''))

  stats.finalCount = cleaned.length

  return { cleanedData: cleaned, stats }
}

/**
 * Supprime les doublons exact
 */
function removeDuplicates(data: DataPoint[], stats: CleaningStats): DataPoint[] {
  const seen = new Set<string>()
  const unique: DataPoint[] = []

  data.forEach(row => {
    const key = JSON.stringify(row)
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(row)
    } else {
      stats.duplicatesRemoved++
    }
  })

  return unique
}

/**
 * Gère les valeurs nulles/vides
 */
function handleNulls(data: DataPoint[], stats: CleaningStats): DataPoint[] {
  return data.map(row => {
    const cleaned: DataPoint = { ...row }

    Object.keys(cleaned).forEach(key => {
      const value = cleaned[key]

      // Considérer comme null
      if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
        // Pour les colonnes numériques, utiliser 0 ou la moyenne
        // Pour les colonnes texte, utiliser 'N/A'
        const columnValues = data
          .map(r => r[key])
          .filter(v => v !== null && v !== undefined && v !== '')

        if (columnValues.length > 0 && typeof columnValues[0] === 'number') {
          const avg = columnValues.reduce((a, b) => (a as number) + (b as number), 0) / columnValues.length
          cleaned[key] = Math.round(avg as number)
        } else {
          cleaned[key] = 'N/A'
        }

        stats.nullsHandled++
      }
    })

    return cleaned
  })
}

/**
 * Corrige les types de données
 */
function fixDataTypes(data: DataPoint[], stats: CleaningStats): DataPoint[] {
  if (data.length === 0) return data

  // Inférer les types de la première ligne
  const inferredTypes = inferTypes(data)

  return data.map(row => {
    const fixed: DataPoint = { ...row }

    Object.keys(fixed).forEach(key => {
      const value = fixed[key]
      const expectedType = inferredTypes[key]

      if (value === null || value === undefined || value === 'N/A') {
        return // Garder N/A ou null
      }

      try {
        if (expectedType === 'number') {
          const num = parseFloat(String(value))
          if (!isNaN(num)) {
            fixed[key] = num
            stats.typesFixed++
          }
        } else if (expectedType === 'boolean') {
          if (
            value === 'true' ||
            value === '1' ||
            value === 1 ||
            value === true ||
            value === 'yes' ||
            value === 'oui'
          ) {
            fixed[key] = true
          } else if (
            value === 'false' ||
            value === '0' ||
            value === 0 ||
            value === false ||
            value === 'no' ||
            value === 'non'
          ) {
            fixed[key] = false
          }
          stats.typesFixed++
        } else if (expectedType === 'date') {
          try {
            const date = new Date(String(value))
            if (!isNaN(date.getTime())) {
              fixed[key] = date
              stats.typesFixed++
            }
          } catch (e) {
            // Garder la valeur originale
          }
        }
      } catch (error) {
        // Garder la valeur originale en cas d'erreur
      }
    })

    return fixed
  })
}

/**
 * Infère les types de données
 */
function inferTypes(data: DataPoint[]): Record<string, string> {
  const types: Record<string, string> = {}

  if (data.length === 0) return types

  const firstRow = data[0]

  Object.keys(firstRow).forEach(key => {
    const values = data.map(r => r[key]).filter(v => v !== null && v !== undefined && v !== 'N/A')

    if (values.length === 0) {
      types[key] = 'string'
      return
    }

    const sample = values[0]

    if (typeof sample === 'number') {
      types[key] = 'number'
    } else if (typeof sample === 'boolean') {
      types[key] = 'boolean'
    } else {
      const strSample = String(sample).toLowerCase()

      // Déterminer si c'est une date
      if (
        strSample.includes('-') ||
        strSample.includes('/') ||
        strSample.match(/^\d{4}/)
      ) {
        try {
          new Date(strSample)
          types[key] = 'date'
          return
        } catch (e) {
          // Pas une date valide
        }
      }

      // Déterminer si c'est un booléen
      if (strSample === 'true' || strSample === 'false' || strSample === 'yes' || strSample === 'no') {
        types[key] = 'boolean'
        return
      }

      // Déterminer si c'est un nombre
      if (!isNaN(parseFloat(strSample))) {
        types[key] = 'number'
        return
      }

      types[key] = 'string'
    }
  })

  return types
}

/**
 * Génère un rapport de nettoyage
 */
export function generateCleaningReport(stats: CleaningStats): string {
  const lines = [
    '🧹 **Rapport de Nettoyage Automatique**',
    '',
    `📊 Enregistrements : ${stats.originalCount} → ${stats.finalCount}`,
    `🗑️  Doublons supprimés : ${stats.duplicatesRemoved}`,
    `❌ Valeurs nulles traitées : ${stats.nullsHandled}`,
    `🔧 Types corrigés : ${stats.typesFixed}`,
    `✅ Réduction : ${((1 - stats.finalCount / stats.originalCount) * 100).toFixed(1)}%`,
  ]

  return lines.join('\n')
}

/**
 * Valide la qualité des données nettoyées
 */
export function validateDataQuality(data: DataPoint[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = []

  if (data.length === 0) {
    issues.push('Aucune donnée à valider')
    return { isValid: false, issues }
  }

  if (data.length > 100000) {
    issues.push('Plus de 100 000 lignes (performance potentiellement dégradée)')
  }

  // Vérifier la cohérence des colonnes
  const firstKeys = Object.keys(data[0])
  const inconsistentRows = data.filter(row => Object.keys(row).length !== firstKeys.length)

  if (inconsistentRows.length > 0) {
    issues.push(`${inconsistentRows.length} lignes avec structure incohérente`)
  }

  // Compter les nulls
  let nullCount = 0
  data.forEach(row => {
    Object.values(row).forEach(val => {
      if (val === null || val === undefined) {
        nullCount++
      }
    })
  })

  if (nullCount > data.length * Object.keys(data[0]).length * 0.5) {
    issues.push('Plus de 50% de valeurs nulles/vides')
  }

  return { isValid: issues.length === 0, issues }
}
