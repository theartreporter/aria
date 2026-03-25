import { NextRequest, NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/client'
import { getAgentSystemPrompt, AGENTS } from '@/lib/agents'
import { AgentName, Message } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { agentName, question, mode, conversationHistory } = await request.json()

    if (!agentName || !question || !mode) {
      return NextResponse.json({ error: 'Missing agentName, question, or mode' }, { status: 400 })
    }

    // Validate agent exists
    if (!AGENTS[agentName as AgentName]) {
      return NextResponse.json({ error: 'Invalid agent name' }, { status: 400 })
    }

    const client = getAnthropicClient()
    const systemPrompt = getAgentSystemPrompt(agentName as AgentName, mode)

    // Build messages array with conversation history
    const messages: Message[] = [
      ...(conversationHistory || []),
      { role: 'user', content: question },
    ]

    const response = await client.messages.create({
      model: 'claude-opus-4-20250805',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    return NextResponse.json({
      name: agentName,
      response: content.text,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Error in single-agent route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
