export function prettyPrintDate(date: string) {
  return new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function prettyPrintDateTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
