// ============================================
// DUNGEONS — 7 multi-hour instances
// ============================================

export type Dungeon = {
  id: string
  name: string
  icon: string
  category: string
  duration_hours: number
  difficulty: number  // 1-5 stars
  description: string
  objectives: string[]
  xp_reward: number
  shadow_reward: string
  unlock: {
    category_xp: number
    honor: number
  }
}

export const DUNGEONS: Dungeon[] = [
  {
    id: 'iron_temple',
    name: 'The Iron Temple',
    icon: '⚔️',
    category: 'body',
    duration_hours: 2,
    difficulty: 3,
    description: 'Two uninterrupted hours of physical training. No stopping. No shortcuts.',
    objectives: [
      'Full workout session',
      'Track every set',
      'Finish at full effort',
    ],
    xp_reward: 200,
    shadow_reward: 'shadow_of_iron',
    unlock: { category_xp: 100, honor: 50 },
  },
  {
    id: 'focus_chamber',
    name: 'The Focus Chamber',
    icon: '🧠',
    category: 'mind',
    duration_hours: 4,
    difficulty: 4,
    description: 'Four hours of deep work. Phone off. Doors closed. One task only.',
    objectives: [
      'Single task for 4 hours',
      'No phone, no interruptions',
      'Document your output',
    ],
    xp_reward: 250,
    shadow_reward: 'shadow_of_discipline',
    unlock: { category_xp: 100, honor: 50 },
  },
  {
    id: 'creation_forge',
    name: 'The Creation Forge',
    icon: '🥷',
    category: 'mastery',
    duration_hours: 6,
    difficulty: 5,
    description: 'Six hours to build, ship, and finish something real.',
    objectives: [
      'Build from scratch',
      'Ship something functional',
      'Document what you made',
    ],
    xp_reward: 300,
    shadow_reward: 'shadow_of_fire',
    unlock: { category_xp: 200, honor: 60 },
  },
  {
    id: 'treasury_vault',
    name: 'The Treasury Vault',
    icon: '💰',
    category: 'autonomy',
    duration_hours: 3,
    difficulty: 3,
    description: 'Three hours of full financial audit. Every dollar. Every debt. Every account.',
    objectives: [
      'List all accounts',
      'List all debts',
      'Calculate net worth',
      'Set one financial action',
    ],
    xp_reward: 220,
    shadow_reward: 'shadow_of_coin',
    unlock: { category_xp: 100, honor: 50 },
  },
  {
    id: 'grove_retreat',
    name: 'The Grove Retreat',
    icon: '🌱',
    category: 'growth',
    duration_hours: 4,
    difficulty: 4,
    description: 'Four hours of deep learning. Read a book. Watch a course. Take notes.',
    objectives: [
      'Consume one topic deeply',
      'Take written notes',
      'Extract 5 takeaways',
    ],
    xp_reward: 250,
    shadow_reward: 'shadow_of_growth',
    unlock: { category_xp: 100, honor: 50 },
  },
  {
    id: 'social_gauntlet',
    name: 'The Social Gauntlet',
    icon: '🤝',
    category: 'connection',
    duration_hours: 3,
    difficulty: 4,
    description: 'Three hours of deliberate connection. Calls, meetings, conversations.',
    objectives: [
      'Reach out to 3 people',
      'Have one deep conversation',
      'Fully present, no phone',
    ],
    xp_reward: 220,
    shadow_reward: 'shadow_of_presence',
    unlock: { category_xp: 100, honor: 50 },
  },
  {
    id: 'sunlit_hall',
    name: 'The Sunlit Hall',
    icon: '☀️',
    category: 'joy',
    duration_hours: 8,
    difficulty: 3,
    description: 'A full day of joy. No productivity. No obligation. Only what makes you feel alive.',
    objectives: [
      'No work, no productivity',
      'Do what genuinely delights you',
      'No screens if possible',
    ],
    xp_reward: 300,
    shadow_reward: 'shadow_of_the_sun',
    unlock: { category_xp: 100, honor: 50 },
  },
]

export function getDungeonById(id: string): Dungeon | undefined {
  return DUNGEONS.find(d => d.id === id)
}