// ============================================
// SKILL TREES — 7 Paths, 6 tiers each
// ============================================

export type SkillNode = {
  id: string
  path: string
  tier: number
  name: string
  icon: string
  description: string
  parent_id: string | null
  requirement: { category_xp: number; honor: number }
  mastery_test: string
  passive: { type: 'xp_bonus'; category: string; percent: number; description: string }
}

export const SKILL_TREES: Record<string, SkillNode[]> = {
  body: [
    { id: 'iron_1', path: 'body', tier: 1, name: 'Awakened Body', icon: '⚔️', description: 'The moment you decide the body matters.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Body task.', passive: { type: 'xp_bonus', category: 'body', percent: 2, description: '+2% Body XP' } },
    { id: 'iron_2', path: 'body', tier: 2, name: 'Devoted', icon: '🥊', description: 'Training is no longer optional. It is identity.', parent_id: 'iron_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Body tasks.', passive: { type: 'xp_bonus', category: 'body', percent: 4, description: '+4% Body XP' } },
    { id: 'iron_3', path: 'body', tier: 3, name: 'Adept', icon: '🔥', description: 'The body responds. Movement is easy.', parent_id: 'iron_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Body tasks.', passive: { type: 'xp_bonus', category: 'body', percent: 6, description: '+6% Body XP' } },
    { id: 'iron_4', path: 'body', tier: 4, name: 'Expert', icon: '💪', description: 'You are stronger than most. You know it.', parent_id: 'iron_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Body tasks.', passive: { type: 'xp_bonus', category: 'body', percent: 8, description: '+8% Body XP' } },
    { id: 'iron_5', path: 'body', tier: 5, name: 'Master', icon: '🛡️', description: 'Your body is a weapon you built yourself.', parent_id: 'iron_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Body tasks.', passive: { type: 'xp_bonus', category: 'body', percent: 12, description: '+12% Body XP' } },
    { id: 'iron_6', path: 'body', tier: 6, name: 'The Iron Monarch', icon: '👑', description: 'Iron in flesh. Iron in will. Iron in name.', parent_id: 'iron_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Body tasks.', passive: { type: 'xp_bonus', category: 'body', percent: 20, description: '+20% Body XP' } },
  ],
  mind: [
    { id: 'mind_1', path: 'mind', tier: 1, name: 'Awakened Mind', icon: '👁️', description: 'You decide to own your inner world.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Mind task.', passive: { type: 'xp_bonus', category: 'mind', percent: 2, description: '+2% Mind XP' } },
    { id: 'mind_2', path: 'mind', tier: 2, name: 'Focused Attention', icon: '🎯', description: 'Your attention is no longer scattered.', parent_id: 'mind_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Mind tasks.', passive: { type: 'xp_bonus', category: 'mind', percent: 4, description: '+4% Mind XP' } },
    { id: 'mind_3', path: 'mind', tier: 3, name: 'Deep Reader', icon: '📖', description: 'Ideas enter and stay. Knowledge compounds.', parent_id: 'mind_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Mind tasks.', passive: { type: 'xp_bonus', category: 'mind', percent: 6, description: '+6% Mind XP' } },
    { id: 'mind_4', path: 'mind', tier: 4, name: 'The Unmoved', icon: '🗿', description: 'Emotions pass through. Nothing controls you.', parent_id: 'mind_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Mind tasks.', passive: { type: 'xp_bonus', category: 'mind', percent: 8, description: '+8% Mind XP' } },
    { id: 'mind_5', path: 'mind', tier: 5, name: 'Void Walker', icon: '🌌', description: 'You can sit with silence. Most cannot.', parent_id: 'mind_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Mind tasks.', passive: { type: 'xp_bonus', category: 'mind', percent: 12, description: '+12% Mind XP' } },
    { id: 'mind_6', path: 'mind', tier: 6, name: 'The Awakened Sage', icon: '🔮', description: 'The mind is a tool. You are the one using it.', parent_id: 'mind_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Mind tasks.', passive: { type: 'xp_bonus', category: 'mind', percent: 20, description: '+20% Mind XP' } },
  ],
  mastery: [
    { id: 'craft_1', path: 'mastery', tier: 1, name: 'Apprentice', icon: '🥷', description: 'Every master was once a beginner who showed up.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Mastery task.', passive: { type: 'xp_bonus', category: 'mastery', percent: 2, description: '+2% Mastery XP' } },
    { id: 'craft_2', path: 'mastery', tier: 2, name: 'Daily Practice', icon: '⚒️', description: 'You practice when you feel like it, and when you do not.', parent_id: 'craft_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Mastery tasks.', passive: { type: 'xp_bonus', category: 'mastery', percent: 4, description: '+4% Mastery XP' } },
    { id: 'craft_3', path: 'mastery', tier: 3, name: 'Craftsperson', icon: '🔨', description: 'You build things. Small. Real. Finished.', parent_id: 'craft_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Mastery tasks.', passive: { type: 'xp_bonus', category: 'mastery', percent: 6, description: '+6% Mastery XP' } },
    { id: 'craft_4', path: 'mastery', tier: 4, name: 'Specialist', icon: '⚙️', description: 'Depth over breadth. You chose one thing.', parent_id: 'craft_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Mastery tasks.', passive: { type: 'xp_bonus', category: 'mastery', percent: 8, description: '+8% Mastery XP' } },
    { id: 'craft_5', path: 'mastery', tier: 5, name: 'The Maker', icon: '🏗️', description: 'You ship. Real work exists because of you.', parent_id: 'craft_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Mastery tasks.', passive: { type: 'xp_bonus', category: 'mastery', percent: 12, description: '+12% Mastery XP' } },
    { id: 'craft_6', path: 'mastery', tier: 6, name: 'Grandmaster', icon: '🗡️', description: 'In your domain, you are the standard.', parent_id: 'craft_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Mastery tasks.', passive: { type: 'xp_bonus', category: 'mastery', percent: 20, description: '+20% Mastery XP' } },
  ],
  autonomy: [
    { id: 'coin_1', path: 'autonomy', tier: 1, name: 'Coin Counter', icon: '💰', description: 'You start looking at the number instead of avoiding it.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Autonomy task.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 2, description: '+2% Autonomy XP' } },
    { id: 'coin_2', path: 'autonomy', tier: 2, name: 'Saver', icon: '🏦', description: 'You keep more than you spend. The gap grows.', parent_id: 'coin_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Autonomy tasks.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 4, description: '+4% Autonomy XP' } },
    { id: 'coin_3', path: 'autonomy', tier: 3, name: 'Budget Keeper', icon: '📊', description: 'Money goes where you decide. Not where inertia sends it.', parent_id: 'coin_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Autonomy tasks.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 6, description: '+6% Autonomy XP' } },
    { id: 'coin_4', path: 'autonomy', tier: 4, name: 'Investor', icon: '📈', description: 'Money works while you sleep. Compounding has begun.', parent_id: 'coin_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Autonomy tasks.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 8, description: '+8% Autonomy XP' } },
    { id: 'coin_5', path: 'autonomy', tier: 5, name: 'Free', icon: '🕊️', description: 'You no longer need the next paycheck to survive.', parent_id: 'coin_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Autonomy tasks.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 12, description: '+12% Autonomy XP' } },
    { id: 'coin_6', path: 'autonomy', tier: 6, name: 'Emperor', icon: '🏛️', description: 'You answer to no one. You built that.', parent_id: 'coin_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Autonomy tasks.', passive: { type: 'xp_bonus', category: 'autonomy', percent: 20, description: '+20% Autonomy XP' } },
  ],
  growth: [
    { id: 'grove_1', path: 'growth', tier: 1, name: 'Curious', icon: '🌱', description: 'You start asking questions you cannot answer.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Growth task.', passive: { type: 'xp_bonus', category: 'growth', percent: 2, description: '+2% Growth XP' } },
    { id: 'grove_2', path: 'growth', tier: 2, name: 'Learner', icon: '📚', description: 'Learning is a habit. Not an event.', parent_id: 'grove_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Growth tasks.', passive: { type: 'xp_bonus', category: 'growth', percent: 4, description: '+4% Growth XP' } },
    { id: 'grove_3', path: 'growth', tier: 3, name: 'Reader', icon: '📕', description: 'You consume ideas. You remember them.', parent_id: 'grove_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Growth tasks.', passive: { type: 'xp_bonus', category: 'growth', percent: 6, description: '+6% Growth XP' } },
    { id: 'grove_4', path: 'growth', tier: 4, name: 'Polymath', icon: '🧭', description: 'You know things across many fields. Intersections form.', parent_id: 'grove_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Growth tasks.', passive: { type: 'xp_bonus', category: 'growth', percent: 8, description: '+8% Growth XP' } },
    { id: 'grove_5', path: 'growth', tier: 5, name: 'Lifelong Student', icon: '🎓', description: 'You will never finish learning. You know that.', parent_id: 'grove_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Growth tasks.', passive: { type: 'xp_bonus', category: 'growth', percent: 12, description: '+12% Growth XP' } },
    { id: 'grove_6', path: 'growth', tier: 6, name: 'The Wise', icon: '🦉', description: 'Knowledge has become wisdom. You see things others do not.', parent_id: 'grove_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Growth tasks.', passive: { type: 'xp_bonus', category: 'growth', percent: 20, description: '+20% Growth XP' } },
  ],
  connection: [
    { id: 'voice_1', path: 'connection', tier: 1, name: 'Present', icon: '🤝', description: 'You show up. Fully. Not half.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Connection task.', passive: { type: 'xp_bonus', category: 'connection', percent: 2, description: '+2% Connection XP' } },
    { id: 'voice_2', path: 'connection', tier: 2, name: 'Listener', icon: '👂', description: 'You listen to understand. Not to reply.', parent_id: 'voice_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Connection tasks.', passive: { type: 'xp_bonus', category: 'connection', percent: 4, description: '+4% Connection XP' } },
    { id: 'voice_3', path: 'connection', tier: 3, name: 'Confidant', icon: '🫂', description: 'People tell you things they tell no one else.', parent_id: 'voice_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Connection tasks.', passive: { type: 'xp_bonus', category: 'connection', percent: 6, description: '+6% Connection XP' } },
    { id: 'voice_4', path: 'connection', tier: 4, name: 'The Friend', icon: '💛', description: 'You are known. Actually known.', parent_id: 'voice_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Connection tasks.', passive: { type: 'xp_bonus', category: 'connection', percent: 8, description: '+8% Connection XP' } },
    { id: 'voice_5', path: 'connection', tier: 5, name: 'Community Builder', icon: '🏘️', description: 'You bring people together. You create belonging.', parent_id: 'voice_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Connection tasks.', passive: { type: 'xp_bonus', category: 'connection', percent: 12, description: '+12% Connection XP' } },
    { id: 'voice_6', path: 'connection', tier: 6, name: 'The Beloved', icon: '🌹', description: 'Not everyone loves you. But those who do, love you deeply.', parent_id: 'voice_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Connection tasks.', passive: { type: 'xp_bonus', category: 'connection', percent: 20, description: '+20% Connection XP' } },
  ],
  joy: [
    { id: 'flame_1', path: 'joy', tier: 1, name: 'Present to Joy', icon: '✨', description: 'You allow yourself to feel good without guilt.', parent_id: null, requirement: { category_xp: 0, honor: 0 }, mastery_test: 'Complete your first Joy task.', passive: { type: 'xp_bonus', category: 'joy', percent: 2, description: '+2% Joy XP' } },
    { id: 'flame_2', path: 'joy', tier: 2, name: 'Player', icon: '🎮', description: 'Play is no longer a luxury. It is a practice.', parent_id: 'flame_1', requirement: { category_xp: 200, honor: 40 }, mastery_test: 'Complete 20 Joy tasks.', passive: { type: 'xp_bonus', category: 'joy', percent: 4, description: '+4% Joy XP' } },
    { id: 'flame_3', path: 'joy', tier: 3, name: 'Aesthete', icon: '🎨', description: 'You notice beauty. It is everywhere.', parent_id: 'flame_2', requirement: { category_xp: 600, honor: 55 }, mastery_test: 'Complete 60 Joy tasks.', passive: { type: 'xp_bonus', category: 'joy', percent: 6, description: '+6% Joy XP' } },
    { id: 'flame_4', path: 'joy', tier: 4, name: 'Alive', icon: '❤️‍🔥', description: 'You feel more than most people. That is the point.', parent_id: 'flame_3', requirement: { category_xp: 1500, honor: 70 }, mastery_test: 'Complete 150 Joy tasks.', passive: { type: 'xp_bonus', category: 'joy', percent: 8, description: '+8% Joy XP' } },
    { id: 'flame_5', path: 'joy', tier: 5, name: 'Flow Master', icon: '🌊', description: 'You can enter flow at will. Time disappears.', parent_id: 'flame_4', requirement: { category_xp: 3500, honor: 85 }, mastery_test: 'Complete 350 Joy tasks.', passive: { type: 'xp_bonus', category: 'joy', percent: 12, description: '+12% Joy XP' } },
    { id: 'flame_6', path: 'joy', tier: 6, name: 'The Sun', icon: '☀️', description: 'You radiate. People feel better around you.', parent_id: 'flame_5', requirement: { category_xp: 7000, honor: 92 }, mastery_test: 'Complete 700 Joy tasks.', passive: { type: 'xp_bonus', category: 'joy', percent: 20, description: '+20% Joy XP' } },
  ],
}

export const ALL_SKILL_NODES: SkillNode[] = Object.values(SKILL_TREES).flat()

export function getNodeById(id: string): SkillNode | undefined {
  return ALL_SKILL_NODES.find(n => n.id === id)
}

export function getPathLabel(path: string): string {
  const labels: Record<string, string> = {
    body: 'Iron', mind: 'Mind', mastery: 'Craft',
    autonomy: 'Coin', growth: 'Grove', connection: 'Voice', joy: 'Flame',
  }
  return labels[path] || path
}

export function getPathIcon(path: string): string {
  const icons: Record<string, string> = {
    body: '⚔️', mind: '👁️', mastery: '🥷',
    autonomy: '💰', growth: '🌱', connection: '🤝', joy: '✨',
  }
  return icons[path] || '📌'
}

export function getPathColor(path: string): string {
  const colors: Record<string, string> = {
    body: '#00ff88', mind: '#c084fc', mastery: '#facc15',
    autonomy: '#fb923c', growth: '#22d3ee', connection: '#f472b6', joy: '#ff4d4d',
  }
  return colors[path] || '#00ffaa'
}