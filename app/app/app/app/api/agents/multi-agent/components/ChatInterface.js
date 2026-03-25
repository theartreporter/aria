'use client'

import { useState } from 'react'
import AgentCard from './AgentCard'

export default function ChatInterface() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/agents/multi-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setResponses(data.agents)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#d4af37' }}>
            ARIA
          </h1>
          <p className="text-gray-400">Agent Council • Art Advisory Platform</p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the council about art, collecting, markets..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Convening...' : 'Convene'}
            </button>
          </div>
        </form>

        {/* Agents Grid */}
        {responses && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.values(responses).map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        )}

        {!responses && !loading && (
          <div className="text-center text-gray-500">
            <p>Ask a question to convene the council</p>
          </div>
        )}
      </div>
    </div>
  )
}
