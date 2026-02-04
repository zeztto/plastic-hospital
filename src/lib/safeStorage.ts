export function safeParse<T>(key: string, fallback: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T[]
  } catch {
    console.error(`Failed to parse localStorage key "${key}". Resetting to fallback.`)
    localStorage.removeItem(key)
    return fallback
  }
}
