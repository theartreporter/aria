'use client'

import { ConversationMode } from '@/lib/types'
import { MODES } from '@/lib/modes'

interface ModeSelectorProps {
  selectedMode: ConversationMode
  onModeChange: (mode: ConversationMode) => void
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const modes = Object.values(MODES)

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`btn text-xs ${selectedMode === mode.id ? 'btn-primary' : 'btn-secondary'}`}
          title={mode.description}
        >
          <span className="mr-1">{mode.icon}</span>
          {mode.name}
        </button>
      ))}
    </div>
  )
}
