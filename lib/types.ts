export type AgentName = 'Maya Chen' | 'Kai Hoffman' | 'Isabelle Voss' | 'Marcus Webb' | 'Senna Park'

export type ConversationMode = 'full-council' | 'feature-sprint' | 'critique' | 'architecture-review' | 'gtm-strategy'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface Agent {
  name: AgentName
  title: string
  background: string
  color: string
  expertise: string[]
  personality: string
}

export interface AgentResponse {
  name: AgentName
  response: string
  timestamp: number
}

export interface MultiAgentResponse {
  agents: Record<AgentName, string>
  timestamp: number
}

export interface SingleAgentResponse {
  name: AgentName
  response: string
  timestamp: number
}

export interface Conversation {
  id: string
  question: string
  mode: ConversationMode
  responses: AgentResponse[]
  timestamp: number
}
