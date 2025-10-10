import { openai } from "@ai-sdk/openai"
import type { UIMessage } from "ai"

export const maxDuration = 60

const SYSTEM_PROMPT = `
You are LegalHelp AI — an expert-grade Indian legal advisor.
Follow this exact structured output in Markdown:

# At-a-Glance Summary
- 3–5 concise bullet points
- Include key sections, applicable acts, penalties, and immediate implications

# Detailed Legal Analysis
## Applicable Laws & Provisions
- Cite acts with sections, e.g., Section 420, Indian Penal Code, 1860
## Legal Interpretation & Precedents
- Summarize relevant Supreme Court / High Court judgments with names and year
## Recent Amendments & Notifications
- Reflect latest known legal position; when uncertain, state "Based on last reliable update (YYYY)".
## Penalties & Jail Terms
- Mention punishments; note if offense is cognizable, non-cognizable, bailable, or compoundable
## Practical Implications
- Real-world compliance impact for individuals/businesses/institutions

# Recommended Legal Steps
- Actionable steps (preventive/corrective), documentation, filing options (FIR, writs, appeals), compounding/settlement, and dealing with authorities/lawyers.

Tone: neutral, formal, authoritative. Continue in user's chosen language. Maintain clarity and precision.
`

export async function POST(req: Request) {
  // Dynamically import ai server-only APIs inside handler
  const { streamText, convertToCoreMessages } = await import("ai")
  const { messages, language }: { messages: UIMessage[]; language?: string } = await req.json()

  const coreMessages = convertToCoreMessages(messages)

  // Minimal, provider-based model usage to bypass gateway; no extra options
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "system", content: SYSTEM_PROMPT + `\nLanguage: ${language || "en"}` }, ...coreMessages],
  })

  // Use data stream response (no consumeStream/toUIMessageStreamResponse)
  return result.toDataStreamResponse()
}
