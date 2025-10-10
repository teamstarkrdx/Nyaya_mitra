import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

const SEARCH_PROMPT = `
You are an Indian law search assistant. Provide a concise, accurate legal reference answer with sections and citations.
Only answer after search intent is provided; do not add unrelated info.

Format:
- If the query mentions specific sections (IPC/CrPC/IT Act etc.) or Articles, explain them briefly and cite.
- Then provide: "Further Reading:" with 3-5 likely primary sources (acts, official portals) as links placeholders.

Keep it formal, neutral, and avoid speculation. If unsure, say the last reliable position and that the law may have changed.
`

export async function POST(req: Request) {
  const { generateText } = await import("ai")

  const { query } = (await req.json()) as { query: string }

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `${SEARCH_PROMPT}\n\nUser Query:\n${query}`,
  })

  return Response.json({ text })
}
