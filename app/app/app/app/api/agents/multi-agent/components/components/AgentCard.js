export default function AgentCard({ agent }) {
  const colorMap = {
    pink: '#ec4899',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f97316',
    purple: '#a855f7'
  }

  return (
    <div className="agent-card" style={{ borderTopColor: colorMap[agent.color], borderTopWidth: '3px' }}>
      <div className="mb-3">
        <h3 className="font-bold text-sm" style={{ color: colorMap[agent.color] }}>
          {agent.name}
        </h3>
        <p className="text-xs text-gray-500">{agent.role}</p>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {agent.response}
      </p>
    </div>
  )
}
