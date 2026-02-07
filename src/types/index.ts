export interface DataPoint {
  [key: string]: string | number | boolean | null
}

export interface DataSource {
  id: string
  name: string
  type: "csv" | "excel" | "supabase"
  data: DataPoint[]
  columns: string[]
  uploadedAt: Date
}

export interface QueryResult {
  columns: string[]
  data: DataPoint[]
  executionTime: number
  rowCount: number
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "scatter"
  xAxis: string
  yAxis: string | string[]
  title: string
}

export interface Anomaly {
  id: string
  type: "outlier" | "drop" | "spike"
  metric: string
  value: number
  threshold: number
  severity: "low" | "medium" | "high"
  timestamp: Date
  description: string
}

export interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  query?: string
  results?: QueryResult
  timestamp: Date
}
