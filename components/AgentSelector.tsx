'use client'

import { AgentName } from '@/lib/types'
import { AGENTS } from '@/lib/agents'

interface AgentSelectorProps {
  selectedAgent: AgentName
  onAgentChange: (agent: AgentName) => void
}

export function AgentSelector({ selectedAgent, onAgentChange }: AgentSelectorProps) {
  const agentNames = Object.keys(AGENTS) as AgentName[]

  return (
    <select
      value={selectedAgent}
      onChange={(e) => onAgentChange(e.target.value as AgentName)}
      className="input bg-gray-900 border border-gray-800 text-white px-3 py-2"
    >
      {agentNames.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )
}
