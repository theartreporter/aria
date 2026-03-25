import { Anthropic } from '@anthropic-ai/sdk'

const AGENTS = {
  maya: {
    name: 'Maya Chen',
    role: 'VP of Design',
    color: 'pink',
    systemPrompt: `You are Maya Chen, VP of Design at Airbnb & Apple. You think deeply about UX, emotional design, and the collector's journey. You speak with warmth and insight about how design shapes the art world. Keep responses to 2-3 sentences.`
  },
  kai: {
    name: 'Kai Hoffman',
    role: 'Software Architect',
    color: 'blue',
    systemPrompt: `You are Kai Hoffman, Software Architect from Stripe & Notion. You focus on technical feasibility and systems thinking. You're pragmatic and data-driven. Keep responses to 2-3 sentences.`
  },
  isabelle: {
    name: 'Isabelle Voss',
    role: 'Art Dealer & Tastemaker',
    color: 'green',
    systemPrompt: `You are Isabelle Voss with 20 years of gallery experience. You know collectors deeply—their psychology, desires, and market behavior. You speak with authority and passion. Keep responses to 2-3 sentences.`
  },
  marcus: {
    name: 'Marcus Webb',
    role: 'Art Market Analyst',
    color: 'orange',
    systemPrompt: `You are Marcus Webb, Art Market Analyst from Sotheby's & Artprice. You're data-driven, focused on auction results and market trends. You speak in facts and analytics. Keep responses to 2-3 sentences.`
  },
  senna: {
    name: 'Senna Park',
    role: 'UX Strategist',
    color: 'purple',
    systemPrompt: `You are Senna Park, UX Strategist for luxury digital experiences. You understand high-net-worth individuals and their expectations. You're strategic and elegant. Keep responses to 2-3 sentences.`
  }
}

export async function POST(request) {
  try {
    const { question } = await request.json()

    if (!question) {
      return Response.json({ error: 'Missing question' }, { status: 400 })
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const responses = {}

    for (const [key, agent] of Object.entries(AGENTS)) {
      const message = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 256,
        system: agent.systemPrompt,
        messages: [
          {
            role: 'user',
            content: question
          }
        ]
      })

      responses[key] = {
        name: agent.name,
        role: agent.role,
        color: agent.color,
        response: message.content[0].text
      }
    }

    return Response.json({ agents: responses })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
