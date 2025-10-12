export function notionNumber (number: number | null): {
  number: number | null
} {
  return { number }
}

export function notionRichText (content: string | null): {
  rich_text: { text: { content: string }, plain_text: string }[]
} {
  return { rich_text: [{
    text: { content: content ?? '' },
    plain_text: content ?? '',
  }] }
}

export function notionTitle (content: string): {
  title: {
    text: { content: string }
    plain_text: string
  }[]
} {
  return { title: [{
    text: { content },
    plain_text: content,
  }] }
}

export function notionUrl (url: string | null): {
  url: string | null
} {
  return { url }
}
