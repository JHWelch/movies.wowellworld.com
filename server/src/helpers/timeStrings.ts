export const minutesAsTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const minutesString = (minutes % 60).toString().padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const hoursString = (hours % 12 || 12).toString()

  return `${hoursString}:${minutesString} ${period}`
}

export const timeStringAsMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = time.slice(-2)

  return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + minutes
}
