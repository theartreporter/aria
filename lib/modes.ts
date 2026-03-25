import { ConversationMode } from './types'

export interface ModeConfig {
  id: ConversationMode
  name: string
  description: string
  icon: string
}

export const MODES: Record<ConversationMode, ModeConfig> = {
  'full-council': {
    id: 'full-council',
    name: 'Full Council Debate',
    description: 'All 5 advisors weigh in with their perspectives',
    icon: '🏛️',
  },
  'feature-sprint': {
    id: 'feature-sprint',
    name: 'Feature Sprint',
    description: 'Focus on feasibility, timeline, and shipping velocity',
    icon: '⚡',
  },
  critique: {
    id: 'critique',
    name: 'Critique Mode',
    description: 'Constructive criticism and risk identification',
    icon: '🎯',
  },
  'architecture-review': {
    id: 'architecture-review',
    name: 'Architecture Review',
    description: 'Systems thinking and technical deep-dive',
    icon: '🏗️',
  },
  'gtm-strategy': {
    id: 'gtm-strategy',
    name: 'GTM Strategy',
    description: 'Go-to-market positioning and collector acquisition',
    icon: '🎪',
  },
}

export const DEFAULT_MODE: ConversationMode = 'full-council'
