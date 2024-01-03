export function notionNumber(number: number | null): {
  number: number | null
} {
  return { number }
}

export function notionRichText(text: string | null): {
  rich_text: { text: { content: string } }[]
} {
  return { rich_text: [{ text: { content: text ?? '' } }] }
}

export function notionTitle(text: string): {
  title: { text: { content: string } }[]
} {
  return { title: [{ text: { content: text } }] }
}

export function notionUrl(url: string | null): {
  url: string | null
} {
  return { url }
}
