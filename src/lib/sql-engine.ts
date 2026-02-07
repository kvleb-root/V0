import { DataPoint, QueryResult } from '@/types/index'

/**
 * Simule la conversion d'une question en langue naturelle en requête SQL
 */
export function parseNaturalLanguageQuery(question: string): {
  operation: string
  field?: string
  filters?: string
  orderBy?: string
  limit?: number
} {
  const lowerQuestion = question.toLowerCase()

  // Détection de l'opération
  let operation = "select"
  let field = "*"
  let limit = 10

  if (lowerQuestion.includes("count") || lowerQuestion.includes("combien")) {
    operation = "count"
  } else if (lowerQuestion.includes("somme") || lowerQuestion.includes("total")) {
    operation = "sum"
  } else if (lowerQuestion.includes("moyenne") || lowerQuestion.includes("mean")) {
    operation = "avg"
  } else if (lowerQuestion.includes("max") || lowerQuestion.includes("maximum")) {
    operation = "max"
  } else if (lowerQuestion.includes("min") || lowerQuestion.includes("minimum")) {
    operation = "min"
  } else if (lowerQuestion.includes("top") || lowerQuestion.includes("meilleur")) {
    operation = "top"
    limit = extractNumber(question) || 5
  }

  return {
    operation,
    field,
    limit,
  }
}

/**
 * Exécute une requête sur les données chargées
 */
export function executeQuery(
  data: DataPoint[],
  operation: string,
  field: string = "*",
  limit: number = 10
): QueryResult {
  const startTime = performance.now()

  if (data.length === 0) {
    return {
      columns: [],
      data: [],
      executionTime: performance.now() - startTime,
      rowCount: 0,
    }
  }

  const columns = Object.keys(data[0])
  let result: DataPoint[] = []

  switch (operation) {
    case "count":
      result = [{ count: data.length }]
      break

    case "sum": {
      const numField = field === "*" ? columns.find(c => typeof data[0][c] === "number") : field
      if (numField) {
        const sum = data.reduce((acc, row) => {
          const val = row[numField]
          return acc + (typeof val === "number" ? val : 0)
        }, 0)
        result = [{ [numField]: sum }]
      }
      break
    }

    case "avg": {
      const numField = field === "*" ? columns.find(c => typeof data[0][c] === "number") : field
      if (numField) {
        const sum = data.reduce((acc, row) => {
          const val = row[numField]
          return acc + (typeof val === "number" ? val : 0)
        }, 0)
        const avg = sum / data.length
        result = [{ [numField]: Math.round(avg * 100) / 100 }]
      }
      break
    }

    case "max": {
      const numField = field === "*" ? columns.find(c => typeof data[0][c] === "number") : field
      if (numField) {
        const max = Math.max(
          ...data
            .map(row => (typeof row[numField] === "number" ? row[numField] : 0))
            .filter((v): v is number => v !== null)
        )
        result = [{ [numField]: max }]
      }
      break
    }

    case "min": {
      const numField = field === "*" ? columns.find(c => typeof data[0][c] === "number") : field
      if (numField) {
        const min = Math.min(
          ...data
            .map(row => (typeof row[numField] === "number" ? row[numField] : 0))
            .filter((v): v is number => v !== null)
        )
        result = [{ [numField]: min }]
      }
      break
    }

    case "top":
      result = data
        .sort((a, b) => {
          const numField = field === "*" ? columns.find(c => typeof a[c] === "number") : field
          if (!numField) return 0
          const aVal = typeof a[numField] === "number" ? (a[numField] as number) : 0
          const bVal = typeof b[numField] === "number" ? (b[numField] as number) : 0
          return bVal - aVal
        })
        .slice(0, limit)
      break

    case "select":
    default:
      result = data.slice(0, limit)
  }

  return {
    columns: result.length > 0 ? Object.keys(result[0]) : [],
    data: result,
    executionTime: performance.now() - startTime,
    rowCount: result.length,
  }
}

/**
 * Extrait un nombre d'une chaîne
 */
function extractNumber(str: string): number | null {
  const match = str.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Génère une réponse textuelle pour les résultats
 */
export function generateResponse(operation: string, result: QueryResult): string {
  if (result.data.length === 0) {
    return "Aucune donnée trouvée pour cette requête."
  }

  switch (operation) {
    case "count":
      return `Nombre total de lignes: ${result.data[0]?.count || 0}`

    case "sum": {
      const key = Object.keys(result.data[0])[0]
      return `Somme totale: ${result.data[0]?.[key] || 0}`
    }

    case "avg": {
      const key = Object.keys(result.data[0])[0]
      return `Moyenne: ${result.data[0]?.[key] || 0}`
    }

    case "max": {
      const key = Object.keys(result.data[0])[0]
      return `Valeur maximale: ${result.data[0]?.[key] || 0}`
    }

    case "min": {
      const key = Object.keys(result.data[0])[0]
      return `Valeur minimale: ${result.data[0]?.[key] || 0}`
    }

    case "top":
      return `Top ${result.rowCount} résultats trouvés`

    default:
      return `${result.rowCount} résultats trouvés`
  }
}
