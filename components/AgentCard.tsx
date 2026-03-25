'use client'

import { Agent, AgentName } from '@/lib/types'
import { AGENTS } from '@/lib/agents'

interface AgentCardProps {
  agentName: AgentName
  response: string
  isLoading?: boolean
}

export function AgentCard({ agentName, response, isLoading = false }: AgentCardProps) {
  const agent = AGENTS[agentName]

  const colorClass = {
    'Maya Chen': 'agent-card-pink',
    'Kai Hoffman': 'agent-card-blue',
    'Isabelle Voss': 'agent-card-green',
    'Marcus Webb': 'agent-card-orange',
    'Senna Park': 'agent-card-purple',
  }[agentName]

  return (
    <div className={`agent-card ${colorClass} fade-in`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-xs text-gray-400">{agent.title}</p>
        </div>
        {isLoading && <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse"></div>}
      </div>

      <div className="min-h-24 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded-none w-full animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded-none w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded-none w-4/5 animate-pulse"></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-gray-300">{response}</p>
        )}
      </div>
    </div>
  )
}
