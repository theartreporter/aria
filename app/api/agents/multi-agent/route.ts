import { NextRequest, NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/client'
import { getAgentSystemPrompt, AGENTS } from '@/lib/agents'
import { AgentName, ConversationMode, Message } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { question, mode, conversationHistory } = await request.json()

    if (!question || !mode) {
      return NextResponse.json({ error: 'Missing question or mode' }, { status: 400 })
    }

    const client = getAnthropicClient()
    const agentNames = Object.keys(AGENTS) as AgentName[]

    // Create promises for all 5 agents
    const agentPromises = agentNames.map(async (agentName) => {
      const systemPrompt = getAgentSystemPrompt(agentName, mode)

      // Build messages array with conversation history
      const messages: Message[] = [
        ...(conversationHistory || []),
        { role: 'user', content: question },
      ]

      try {
        const response = await client.messages.create({
          model: 'claude-opus-4-20250805',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages,
        })

        const content = response.content[0]
        if (content.type === 'text') {
          return { agentName, response: content.text }
        }
      } catch (error) {
        console.error(`Error getting response from ${agentName}:`, error)
        return { agentName, response: 'Unable to generate response at this time.' }
      }
    })

    // Wait for all agents to respond
    const results = await Promise.all(agentPromises)

    // Build response object
    const agentResponses: Record<AgentName, string> = {}
    results.forEach(({ agentName, response }) => {
      agentResponses[agentName] = response
    })

    return NextResponse.json({
      agents: agentResponses,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Error in multi-agent route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
