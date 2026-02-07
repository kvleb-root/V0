import { DataPoint, Anomaly } from '@/types/index'

/**
 * Détecte les valeurs aberrantes (outliers) dans un ensemble de données
 */
export function detectOutliers(
  data: DataPoint[],
  field: string,
  threshold: number = 2.5
): Anomaly[] {
  const anomalies: Anomaly[] = []

  // Extraire les valeurs numériques
  const values = data
    .map(d => (typeof d[field] === "number" ? d[field] : null))
    .filter((v): v is number => v !== null)

  if (values.length < 2) return anomalies

  // Calculer la moyenne et l'écart type
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  // Détecter les outliers
  values.forEach((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev)
    if (zScore > threshold) {
      anomalies.push({
        id: `outlier-${index}`,
        type: "outlier",
        metric: field,
        value,
        threshold: mean + threshold * stdDev,
        severity: zScore > 3.5 ? "high" : zScore > 3 ? "medium" : "low",
        timestamp: new Date(),
        description: `Valeur anormale détectée: ${value} (score Z: ${zScore.toFixed(2)})`,
      })
    }
  })

  return anomalies
}

/**
 * Détecte les baisses critiques dans les données
 */
export function detectDrops(
  data: DataPoint[],
  field: string,
  threshold: number = 20
): Anomaly[] {
  const anomalies: Anomaly[] = []

  const values = data
    .map(d => (typeof d[field] === "number" ? d[field] : null))
    .filter((v): v is number => v !== null)

  if (values.length < 2) return anomalies

  // Calculer les variations
  for (let i = 1; i < values.length; i++) {
    const previous = values[i - 1]
    const current = values[i]
    const changePercent = ((current - previous) / previous) * 100

    if (changePercent < -threshold) {
      anomalies.push({
        id: `drop-${i}`,
        type: "drop",
        metric: field,
        value: current,
        threshold: previous * (1 - threshold / 100),
        severity: changePercent < -50 ? "high" : changePercent < -30 ? "medium" : "low",
        timestamp: new Date(),
        description: `Baisse critique détectée: ${changePercent.toFixed(2)}% (de ${previous} à ${current})`,
      })
    }
  }

  return anomalies
}

/**
 * Détecte les pics anormaux dans les données
 */
export function detectSpikes(
  data: DataPoint[],
  field: string,
  threshold: number = 20
): Anomaly[] {
  const anomalies: Anomaly[] = []

  const values = data
    .map(d => (typeof d[field] === "number" ? d[field] : null))
    .filter((v): v is number => v !== null)

  if (values.length < 2) return anomalies

  // Calculer les variations
  for (let i = 1; i < values.length; i++) {
    const previous = values[i - 1]
    const current = values[i]
    const changePercent = ((current - previous) / previous) * 100

    if (changePercent > threshold) {
      anomalies.push({
        id: `spike-${i}`,
        type: "spike",
        metric: field,
        value: current,
        threshold: previous * (1 + threshold / 100),
        severity: changePercent > 100 ? "high" : changePercent > 50 ? "medium" : "low",
        timestamp: new Date(),
        description: `Pic anormal détecté: +${changePercent.toFixed(2)}% (de ${previous} à ${current})`,
      })
    }
  }

  return anomalies
}

/**
 * Détecte tous les types d'anomalies
 */
export function detectAllAnomalies(
  data: DataPoint[],
  field: string
): Anomaly[] {
  const allAnomalies = [
    ...detectOutliers(data, field),
    ...detectDrops(data, field),
    ...detectSpikes(data, field),
  ]

  // Trier par sévérité
  const severityOrder = { high: 0, medium: 1, low: 2 }
  return allAnomalies.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )
}
