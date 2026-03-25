'use client'

import { useState, useRef, useEffect } from 'react'
import { AgentName, ConversationMode, Message, Conversation, MultiAgentResponse } from '@/lib/types'
import { AGENTS } from '@/lib/agents'
import { DEFAULT_MODE } from '@/lib/modes'
import { AgentCard } from './AgentCard'
import { ModeSelector } from './ModeSelector'
import { AgentSelector } from './AgentSelector'

interface ChatInterfaceProps {
  initialMode?: ConversationMode
}

export function ChatInterface({ initialMode = DEFAULT_MODE }: ChatInterfaceProps) {
  const [mode, setMode] = useState<ConversationMode>(initialMode)
  const [singleAgent, setSingleAgent] = useState<AgentName>('Maya Chen')
  const [isSingleAgent, setIsSingleAgent] = useState(false)
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentResponses, setCurrentResponses] = useState<Record<AgentName, string>>({})
  const [loadingAgents, setLoadingAgents] = useState<Set<AgentName>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const responsesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aria-conversations')
    if (saved) {
      setConversations(JSON.parse(saved))
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('aria-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  const scrollToBottom = () => {
    responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentResponses, isLoading])

  const handleConvene = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setIsLoading(true)
    setCurrentResponses({})
    setLoadingAgents(new Set(Object.keys(AGENTS) as AgentName[]))

    try {
      const response = await fetch('/api/agents/multi-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mode,
          conversationHistory: [], // Could add conversation history if persisting
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get responses')
      }

      const data: MultiAgentResponse = await response.json()

      // Set all responses at once
      setCurrentResponses(data.agents)
      setLoadingAgents(new Set())

      // Save conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        question,
        mode,
        responses: Object.entries(data.agents).map(([name, response]) => ({
          name: name as AgentName,
          response,
          timestamp: Date.now(),
        })),
        timestamp: Date.now(),
      }

      setConversations([newConversation, ...conversations])
      setQuestion('')
      inputRef.current?.focus()
    } catch (error) {
      console.error('Error:', error)
      setCurrentResponses({
        'Maya Chen': 'Error getting response. Please try again.',
        'Kai Hoffman': 'Error getting response. Please try again.',
        'Isabelle Voss': 'Error getting response. Please try again.',
        'Marcus Webb': 'Error getting response. Please try again.',
        'Senna Park': 'Error getting response. Please try again.',
      })
      setLoadingAgents(new Set())
    }

    setIsLoading(false)
  }

  const handleSingleAgent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setIsLoading(true)
    setLoadingAgents(new Set([singleAgent]))
    setCurrentResponses({})

    try {
      const response = await fetch('/api/agents/single-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: singleAgent,
          question,
          mode: 'full-council',
          conversationHistory: [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      setCurrentResponses({
        [singleAgent]: data.response,
      })

      setQuestion('')
      inputRef.current?.focus()
    } catch (error) {
      console.error('Error:', error)
      setCurrentResponses({
        [singleAgent]: 'Error getting response. Please try again.',
      })
    }

    setLoadingAgents(new Set())
    setIsLoading(false)
  }

  const agentNames = Object.keys(AGENTS) as AgentName[]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold accent-gold mb-2">ARIA</h1>
              <p className="text-gray-400 text-sm">Agent Council for Art Advisory</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-2">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} saved
              </p>
              <button
                onClick={() => {
                  setConversations([])
                  setCurrentResponses({})
                  localStorage.removeItem('aria-conversations')
                }}
                className="btn btn-secondary text-xs"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Mode and Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {!isSingleAgent ? (
                <ModeSelector selectedMode={mode} onModeChange={setMode} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Speaking with:</span>
                  <AgentSelector selectedAgent={singleAgent} onAgentChange={setSingleAgent} />
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsSingleAgent(!isSingleAgent)
                setCurrentResponses({})
                setQuestion('')
              }}
              className="btn btn-secondary text-xs whitespace-nowrap"
            >
              {isSingleAgent ? '👥 Council Mode' : '👤 1:1 Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Current Question */}
        {Object.keys(currentResponses).length > 0 && (
          <div className="bg-gray-950 border-b border-gray-800 px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Question</p>
              <p className="text-lg text-gold">{question}</p>
            </div>
          </div>
        )}

        {/* Responses Grid */}
        <div className="flex-1 overflow-auto px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {Object.keys(currentResponses).length > 0 ? (
              <>
                {isSingleAgent ? (
                  <div className="max-w-2xl">
                    <AgentCard
                      agentName={singleAgent}
                      response={currentResponses[singleAgent] || ''}
                      isLoading={loadingAgents.has(singleAgent)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agentNames.map((name) => (
                      <AgentCard
                        key={name}
                        agentName={name}
                        response={currentResponses[name] || ''}
                        isLoading={loadingAgents.has(name)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-2">Ask the council something.</p>
                <p className="text-gray-600 text-sm">
                  {isSingleAgent
                    ? `Have a focused conversation with ${singleAgent}.`
                    : 'All 5 advisors will share their perspectives.'}
                </p>
              </div>
            )}

            <div ref={responsesEndRef} />
          </div>
        </div>
      </div>

      {/* Footer / Input */}
      <div className="border-t border-gray-800 bg-gray-950 px-8 py-6">
        <form onSubmit={isSingleAgent ? handleSingleAgent : handleConvene} className="max-w-7xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                isSingleAgent
                  ? `Ask ${singleAgent} something...`
                  : 'Ask the council...'
              }
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="btn btn-primary font-semibold whitespace-nowrap disabled:opacity-50"
            >
              {isSingleAgent ? 'Ask' : 'Convene'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            💡 Tip: Try different modes to see how the council's perspectives shift
          </p>
        </form>
      </div>

      {/* Sidebar / History (Optional - can be toggled) */}
      {conversations.length > 0 && (
        <div className="fixed bottom-20 right-4 max-w-xs bg-gray-950 border border-gray-800 rounded-none p-4 max-h-48 overflow-y-auto">
          <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">Recent Questions</p>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setQuestion(conv.question)
                  setMode(conv.mode)
                  setCurrentResponses(
                    Object.fromEntries(conv.responses.map(r => [r.name, r.response]))
                  )
                }}
                className="block text-xs text-gray-400 hover:text-gold text-left truncate"
              >
                {conv.question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
