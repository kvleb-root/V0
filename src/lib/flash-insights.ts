import { DataPoint } from '@/types/index'

export interface FlashInsight {
  id: string
  type: 'warning' | 'success' | 'info' | 'alert'
  title: string
  message: string
  icon: string
  priority: 'high' | 'medium' | 'low'
  timestamp: Date
}

/**
 * Génère automatiquement les Flash Insights à partir des données
 */
export function generateFlashInsights(data: DataPoint[]): FlashInsight[] {
  const insights: FlashInsight[] = []

  if (data.length === 0) return insights

  // Analyser les données pour détecter des patterns
  insights.push(...detectStockAlerts(data))
  insights.push(...detectSalesAnomalies(data))
  insights.push(...detectNewRecords(data))
  insights.push(...detectTrends(data))

  // Trier par priorité
  return insights.sort((a, b) => {
    const priorityMap = { high: 0, medium: 1, low: 2 }
    return priorityMap[a.priority] - priorityMap[b.priority]
  })
}

/**
 * Détecte les alertes de stock critique
 */
function detectStockAlerts(data: DataPoint[]): FlashInsight[] {
  const alerts: FlashInsight[] = []

  // Chercher une colonne 'stock' ou 'inventory'
  const stockKey = Object.keys(data[0] || {}).find(
    k => k.toLowerCase().includes('stock') || k.toLowerCase().includes('inventory')
  )

  if (!stockKey) return alerts

  const criticalItems = data.filter(row => {
    const stock = row[stockKey]
    return typeof stock === 'number' && stock < 10
  })

  if (criticalItems.length > 0) {
    alerts.push({
      id: `stock-alert-${Date.now()}`,
      type: 'alert',
      title: '⚠️ Stock Critique',
      message: `Attention: ${criticalItems.length} produit(s) avec stock critique (<10 unités)`,
      icon: '📦',
      priority: 'high',
      timestamp: new Date(),
    })
  }

  return alerts
}

/**
 * Détecte les anomalies de ventes
 */
function detectSalesAnomalies(data: DataPoint[]): FlashInsight[] {
  const alerts: FlashInsight[] = []

  // Chercher une colonne 'ventes' ou 'sales'
  const salesKey = Object.keys(data[0] || {}).find(
    k => k.toLowerCase().includes('ventes') || k.toLowerCase().includes('sales')
  )

  if (!salesKey) return alerts

  const salesValues = data
    .map(row => row[salesKey])
    .filter((v): v is number => typeof v === 'number')

  if (salesValues.length === 0) return alerts

  const maxSales = Math.max(...salesValues)
  const avgSales = salesValues.reduce((a, b) => a + b, 0) / salesValues.length
  const threshold = avgSales * 1.5

  if (maxSales > threshold) {
    const recordItem = data.find(row => row[salesKey] === maxSales)
    const recordName = recordItem ? Object.values(recordItem)[0] : 'Nouveau record'

    alerts.push({
      id: `sales-record-${Date.now()}`,
      type: 'success',
      title: '🎉 Record de Ventes',
      message: `Nouveau record détecté: ${maxSales} unités (${recordName})`,
      icon: '📈',
      priority: 'medium',
      timestamp: new Date(),
    })
  }

  return alerts
}

/**
 * Détecte les nouveaux records
 */
function detectNewRecords(data: DataPoint[]): FlashInsight[] {
  const alerts: FlashInsight[] = []

  // Chercher une colonne 'date' ou 'date'
  const dateKey = Object.keys(data[0] || {}).find(
    k => k.toLowerCase().includes('date') || k.toLowerCase().includes('jour')
  )

  if (!dateKey) return alerts

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaySales = data.filter(row => {
    const dateVal = row[dateKey]
    if (!dateVal) return false

    try {
      const date = new Date(String(dateVal))
      date.setHours(0, 0, 0, 0)
      return date.getTime() === today.getTime()
    } catch {
      return false
    }
  })

  if (todaySales.length > 0) {
    alerts.push({
      id: `today-sales-${Date.now()}`,
      type: 'info',
      title: '📅 Aujourd\'hui',
      message: `${todaySales.length} transaction(s) aujourd'hui`,
      icon: '💼',
      priority: 'low',
      timestamp: new Date(),
    })
  }

  return alerts
}

/**
 * Détecte les tendances
 */
function detectTrends(data: DataPoint[]): FlashInsight[] {
  const alerts: FlashInsight[] = []

  // Chercher une colonne numérique pour analyser la tendance
  const numericKey = Object.keys(data[0] || {}).find(
    k => typeof data[0][k] === 'number'
  )

  if (!numericKey) return alerts

  const values = data
    .map(row => row[numericKey])
    .filter((v): v is number => typeof v === 'number')

  if (values.length < 2) return alerts

  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))

  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

  const percentChange = ((avgSecond - avgFirst) / avgFirst) * 100

  if (Math.abs(percentChange) > 10) {
    const direction = percentChange > 0 ? '📈 Hausse' : '📉 Baisse'
    const message = `${direction} de ${Math.abs(percentChange).toFixed(1)}% détectée`

    alerts.push({
      id: `trend-${Date.now()}`,
      type: percentChange > 0 ? 'success' : 'warning',
      title: direction,
      message: message,
      icon: percentChange > 0 ? '📈' : '📉',
      priority: 'medium',
      timestamp: new Date(),
    })
  }

  return alerts
}

/**
 * Formate un Flash Insight pour l'affichage
 */
export function formatFlashInsight(insight: FlashInsight): string {
  return `${insight.icon} **${insight.title}** - ${insight.message}`
}

/**
 * Génère un résumé des Flash Insights
 */
export function generateFlashSummary(insights: FlashInsight[]): string {
  if (insights.length === 0) {
    return '✅ Aucune alerte - Tout va bien!'
  }

  const lines = ['🔔 **Flash Insights (Alertes Temps Réel)**', '']

  const highPriority = insights.filter(i => i.priority === 'high')
  const mediumPriority = insights.filter(i => i.priority === 'medium')

  if (highPriority.length > 0) {
    lines.push('**🔴 Priorité Haute:**')
    highPriority.forEach(insight => {
      lines.push(`- ${formatFlashInsight(insight)}`)
    })
    lines.push('')
  }

  if (mediumPriority.length > 0) {
    lines.push('**🟡 Priorité Moyenne:**')
    mediumPriority.forEach(insight => {
      lines.push(`- ${formatFlashInsight(insight)}`)
    })
    lines.push('')
  }

  const lowPriority = insights.filter(i => i.priority === 'low')
  if (lowPriority.length > 0) {
    lines.push('**🟢 Priorité Basse:**')
    lowPriority.slice(0, 2).forEach(insight => {
      lines.push(`- ${formatFlashInsight(insight)}`)
    })
  }

  return lines.join('\n')
}
