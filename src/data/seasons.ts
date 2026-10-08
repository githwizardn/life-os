// ============================================
// SEASONS — 7 seasons, cycle infinitely
// Each season = 90 days, themed by path
// ============================================

export type SeasonRequirement = {
  type: 'category_xp' | 'shadow' | 'dungeon'
  target: string        // category name, shadow id, or dungeon id
  amount?: number       // for category_xp
  description: string
}

export type Season = {
  num: number
  name: string
  icon: string
  category: string
  color: string
  boss_name: string
  boss_description: string
  requirements: SeasonRequirement[]
  reward_shadow: string  // shadow awarded on defeat
  duration_days: number
}

export const SEASONS: Season[] = [
  {
    num: 1,
    name: 'Season of Iron',
    icon: '⚔️',
    category: 'body',
    color: '#00ff88',
    boss_name: 'The Iron Monarch',
    boss_description: 'The Iron Monarch rules those who never built their body. Defeat him by becoming what you were meant to be.',
    requirements: [
      { type: 'category_xp', target: 'body', amount: 500, description: 'Reach 500 Body XP' },
      { type: 'shadow', target: 'shadow_of_iron', description: 'Extract the Shadow of Iron' },
      { type: 'dungeon', target: 'iron_temple', description: 'Clear The Iron Temple' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 2,
    name: 'Season of Silence',
    icon: '👁️',
    category: 'mind',
    color: '#c084fc',
    boss_name: 'The Void Whisperer',
    boss_description: 'The Void Whisperer feeds on noise and distraction. Only silence can unmake him.',
    requirements: [
      { type: 'category_xp', target: 'mind', amount: 500, description: 'Reach 500 Mind XP' },
      { type: 'shadow', target: 'shadow_of_discipline', description: 'Extract the Shadow of Discipline' },
      { type: 'dungeon', target: 'focus_chamber', description: 'Clear The Focus Chamber' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 3,
    name: 'Season of Fire',
    icon: '🥷',
    category: 'mastery',
    color: '#facc15',
    boss_name: 'The Forge Master',
    boss_description: 'The Forge Master tests what you can build. Only finished work passes.',
    requirements: [
      { type: 'category_xp', target: 'mastery', amount: 500, description: 'Reach 500 Mastery XP' },
      { type: 'shadow', target: 'shadow_of_fire', description: 'Extract the Shadow of Fire' },
      { type: 'dungeon', target: 'creation_forge', description: 'Clear The Creation Forge' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 4,
    name: 'Season of Coin',
    icon: '💰',
    category: 'autonomy',
    color: '#fb923c',
    boss_name: 'The Dragon of Debt',
    boss_description: 'The Dragon guards what you owe and what you fear. Face the numbers. Take back your life.',
    requirements: [
      { type: 'category_xp', target: 'autonomy', amount: 500, description: 'Reach 500 Autonomy XP' },
      { type: 'shadow', target: 'shadow_of_coin', description: 'Extract the Shadow of Coin' },
      { type: 'dungeon', target: 'treasury_vault', description: 'Clear The Treasury Vault' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 5,
    name: 'Season of Grove',
    icon: '🌱',
    category: 'growth',
    color: '#22d3ee',
    boss_name: 'The Eternal Student',
    boss_description: 'The Eternal Student has learned everything. To defeat him, you must learn something he cannot.',
    requirements: [
      { type: 'category_xp', target: 'growth', amount: 500, description: 'Reach 500 Growth XP' },
      { type: 'shadow', target: 'shadow_of_growth', description: 'Extract the Shadow of Growth' },
      { type: 'dungeon', target: 'grove_retreat', description: 'Clear The Grove Retreat' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 6,
    name: 'Season of Voice',
    icon: '🤝',
    category: 'connection',
    color: '#f472b6',
    boss_name: 'The Silent Crowd',
    boss_description: 'The Silent Crowd is everyone you have not reached out to. Break the silence.',
    requirements: [
      { type: 'category_xp', target: 'connection', amount: 500, description: 'Reach 500 Connection XP' },
      { type: 'shadow', target: 'shadow_of_presence', description: 'Extract the Shadow of Presence' },
      { type: 'dungeon', target: 'social_gauntlet', description: 'Clear The Social Gauntlet' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
  {
    num: 7,
    name: 'Season of Flame',
    icon: '✨',
    category: 'joy',
    color: '#ff4d4d',
    boss_name: 'The Gray King',
    boss_description: 'The Gray King is what you become when you stop feeling. Destroy him with joy.',
    requirements: [
      { type: 'category_xp', target: 'joy', amount: 500, description: 'Reach 500 Joy XP' },
      { type: 'shadow', target: 'shadow_of_the_sun', description: 'Extract the Shadow of the Sun' },
      { type: 'dungeon', target: 'sunlit_hall', description: 'Clear The Sunlit Hall' },
    ],
    reward_shadow: 'shadow_of_the_monarch',
    duration_days: 90,
  },
]

export function getSeasonByNum(num: number): Season {
  // Cycle 1..7 -> index 0..6
  const idx = ((num - 1) % 7 + 7) % 7
  return SEASONS[idx]
}