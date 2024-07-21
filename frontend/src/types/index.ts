interface AIResponse {
  overview: string
  alternatives: Alternative[]
}

interface Message {
  role: 'assistant' | 'user'
  content:
    | string
    | Array<{
        source?: {
          type: string
          media_type: string
          data: string
        }
        text?: string
        type: 'image' | 'text'
      }>
}
