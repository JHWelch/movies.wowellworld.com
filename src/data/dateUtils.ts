   export function today (): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return _dateToString(today)
  }

  function _dateToString (date): string {
    return date.toISOString().substring(0, 10)
  }
