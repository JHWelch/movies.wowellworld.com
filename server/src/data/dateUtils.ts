export const today = () => dateToString(new Date())

export const tomorrow = (): string => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return dateToString(tomorrow)
}

export const dateToString = (date: Date): string => {
  const array = date.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit' ,
  }).split('/')

  return [
    array[2],
    array[0],
    array[1],
  ].join('-')
}
