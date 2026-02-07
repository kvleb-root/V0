import { DataPoint, QueryResult } from '@/types/index'

export interface Insight {
  narrative: string
  conclusion: string
  comparison?: string
  sqlQuery: string
  stats: {
    rowCount: number
    timeframe?: string
  }
}

/**
 * Génère une réponse narrative basée sur les résultats d'une requête
 */
export function generateNarrativeInsight(
  question: string,
  results: QueryResult,
  data: DataPoint[]
): Insight {
  const narrative = buildMainNarrative(question, results, data)
  const conclusion = buildConclusion(question, results)
  const comparison = buildComparison(question, results, data)
  
  // Simuler une requête SQL (en production, ce serait la vraie query)
  const sqlQuery = generateSQLQuery(question, results)

  return {
    narrative,
    conclusion,
    comparison,
    sqlQuery,
    stats: {
      rowCount: results.rowCount,
    },
  }
}

/**
 * Construit le récit principal
 */
function buildMainNarrative(question: string, results: QueryResult, data: DataPoint[]): string {
  if (results.data.length === 0) {
    return `Après analyse de ${data.length} enregistrements, aucun résultat ne correspond à votre requête.`
  }

  const totalRecords = data.length
  const resultCount = results.rowCount

  // Déterminer le type de question
  if (question.toLowerCase().includes('top') || question.toLowerCase().includes('meilleur')) {
    return generateTopNarrative(results, totalRecords)
  }
  if (question.toLowerCase().includes('somme') || question.toLowerCase().includes('total')) {
    return generateSumNarrative(results, totalRecords)
  }
  if (question.toLowerCase().includes('moyenne') || question.toLowerCase().includes('mean')) {
    return generateAveragNarrative(results, totalRecords)
  }
  if (question.toLowerCase().includes('count') || question.toLowerCase().includes('combien')) {
    return generateCountNarrative(results, totalRecords)
  }

  // Récit par défaut
  return `Après analyse de ${totalRecords} lignes de données, nous avons trouvé ${resultCount} résultat(s) correspondant à votre demande.`
}

/**
 * Génère une conclusion avec insights clés
 */
function buildConclusion(question: string, results: QueryResult): string {
  if (results.data.length === 0) {
    return `Aucune conclusion à tirer - pas de données trouvées.`
  }

  const firstRow = results.data[0]
  const firstKey = Object.keys(firstRow)[0]
  const firstValue = firstRow[firstKey]

  let conclusion = `Résumé des résultats: `

  if (typeof firstValue === 'number') {
    const allValues = results.data
      .map(row => {
        const val = row[firstKey]
        return typeof val === 'number' ? val : 0
      })
      .filter(v => v !== 0)

    if (allValues.length > 0) {
      const max = Math.max(...allValues)
      const min = Math.min(...allValues)
      const avg = (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2)

      conclusion += `Max: ${max}, Min: ${min}, Moyenne: ${avg}.`
    }
  }

  return conclusion
}

/**
 * Génère une comparaison entre résultats
 */
function buildComparison(question: string, results: QueryResult, data: DataPoint[]): string {
  if (results.data.length < 2) {
    return undefined
  }

  const firstRow = results.data[0]
  const secondRow = results.data[1]
  const compareKey = Object.keys(firstRow)[0]

  const val1 = firstRow[compareKey]
  const val2 = secondRow[compareKey]

  if (typeof val1 === 'number' && typeof val2 === 'number') {
    const diff = val1 - val2
    const percentChange = ((diff / val2) * 100).toFixed(1)
    const direction = diff > 0 ? 'augmentation' : 'baisse'

    return `Comparaison: ${direction} de ${Math.abs(percentChange)}% entre les deux premiers résultats.`
  }

  return undefined
}

/**
 * Génère un récit pour les top results
 */
function generateTopNarrative(results: QueryResult, totalRecords: number): string {
  const bestItem = results.data[0]
  const bestKey = Object.keys(bestItem)[0]
  const bestValue = bestItem[bestKey]

  if (results.data.length === 1) {
    return `Après analyse de ${totalRecords} enregistrements, le meilleur résultat est ${bestValue}.`
  }

  const secondBest = results.data[1]
  const secondValue = secondBest[bestKey]

  return `Après analyse de ${totalRecords} enregistrements, le leader est ${bestValue}, devant ${secondValue}.`
}

/**
 * Génère un récit pour les sommes
 */
function generateSumNarrative(results: QueryResult, totalRecords: number): string {
  const sumKey = Object.keys(results.data[0])[0]
  const total = results.data[0][sumKey]

  return `Après agrégation de ${totalRecords} lignes, le total atteint ${total}.`
}

/**
 * Génère un récit pour les moyennes
 */
function generateAveragNarrative(results: QueryResult, totalRecords: number): string {
  const avgKey = Object.keys(results.data[0])[0]
  const average = results.data[0][avgKey]

  return `Après analyse de ${totalRecords} enregistrements, la moyenne calculée est de ${average}.`
}

/**
 * Génère un récit pour les counts
 */
function generateCountNarrative(results: QueryResult, totalRecords: number): string {
  const count = results.data[0]?.count || results.rowCount

  return `Après analyse de ${totalRecords} enregistrements, nous en avons comptabilisé ${count}.`
}

/**
 * Génère une requête SQL simulée pour affichage
 */
function generateSQLQuery(question: string, results: QueryResult): string {
  const lower = question.toLowerCase()

  if (lower.includes('top') || lower.includes('meilleur')) {
    return `SELECT * FROM data ORDER BY value DESC LIMIT ${results.rowCount};`
  }
  if (lower.includes('somme') || lower.includes('total')) {
    return `SELECT SUM(*) FROM data;`
  }
  if (lower.includes('moyenne') || lower.includes('mean')) {
    return `SELECT AVG(*) FROM data;`
  }
  if (lower.includes('count') || lower.includes('combien')) {
    return `SELECT COUNT(*) FROM data;`
  }

  return `SELECT * FROM data LIMIT ${results.rowCount};`
}

/**
 * Génère une explication détaillée sur les causes possibles
 */
export function generateDetailedExplanation(
  insight: Insight,
  data: DataPoint[]
): string {
  const lines = [
    `📊 **Analyse Détaillée**`,
    ``,
    insight.narrative,
    ``,
    `**Conclusion:**`,
    insight.conclusion,
  ]

  if (insight.comparison) {
    lines.push(``, `**Insights Comparatifs:**`, insight.comparison)
  }

  // Ajouter des détails basés sur les données
  const dataQuality = analyzeDataQuality(data)
  lines.push(``, `**Qualité des Données:**`, dataQuality)

  lines.push(``, `**Requête Exécutée:**`, `\`\`\`sql`, insight.sqlQuery, `\`\`\``)

  return lines.join(`\n`)
}

/**
 * Analyse la qualité des données
 */
function analyzeDataQuality(data: DataPoint[]): string {
  if (data.length === 0) {
    return `❌ Aucune donnée disponible.`
  }

  let nullCount = 0
  let duplicateCount = 0

  // Compter les nulls
  data.forEach(row => {
    Object.values(row).forEach(val => {
      if (val === null || val === undefined || val === '') {
        nullCount++
      }
    })
  })

  // Déterminer les doublons simples
  const uniqueRows = new Set(data.map(row => JSON.stringify(row)))
  duplicateCount = data.length - uniqueRows.size

  const nullPercent = ((nullCount / (data.length * Object.keys(data[0]).length)) * 100).toFixed(1)
  const dupPercent = ((duplicateCount / data.length) * 100).toFixed(1)

  return `✅ ${data.length} enregistrements | ${nullPercent}% de valeurs nulles | ${dupPercent}% de doublons`
}

/**
 * Génère un résumé exécutif
 */
export function generateExecutiveSummary(insights: Insight[]): string {
  if (insights.length === 0) return `Aucun insight disponible.`

  const lines = ['📈 **Résumé Exécutif**', '']

  insights.slice(0, 3).forEach((insight, idx) => {
    lines.push(`${idx + 1}. ${insight.narrative}`)
  })

  return lines.join('\n')
}
