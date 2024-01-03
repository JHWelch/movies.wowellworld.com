export function today(): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dateToString(today)
}

export function dateToString(date: Date): string {
  return date.toISOString().substring(0, 10)
}
