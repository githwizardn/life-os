// ============================================
// SYSTEM VOICE — Pre-written dialogue
// Zero AI. Zero cost. Infinite variety.
// ============================================

export type SystemMood =
  | 'observing'      // default state
  | 'pleased'        // 7-day streak, positive trend
  | 'concerned'      // HONOR < 80
  | 'disappointed'   // HONOR < 50
  | 'impressed'      // recent big win
  | 'ancient'        // season boundaries, rare events

export const SYSTEM_LINES: Record<SystemMood, string[]> = {

  observing: [
    "The System is active. Player status: nominal.",
    "Awaiting input. The System observes.",
    "Systems online. Your move, Player.",
    "The System has been watching. Continue.",
    "Player is present. The System notes this.",
    "The day has begun. The System is ready.",
    "The System registers your arrival.",
    "Nominal state. Proceed, Player.",
    "The System awaits your first action.",
    "Status: present. Trajectory: undetermined.",
    "The System is listening.",
    "Quiet today. The System continues to observe.",
    "The Player returns. The System takes note.",
    "Nothing remarkable yet. The System waits.",
    "The System does not judge. It records.",
  ],

  pleased: [
    "Consistency confirmed. The System acknowledges.",
    "The Player is becoming something. Noted.",
    "Pattern recognized: growth. The System approves.",
    "The System has observed improvement. Continue.",
    "Trajectory: ascending. The System notes this.",
    "The Player holds the line. The System observes with interest.",
    "Seven days. The System expected nothing less.",
    "The System detects discipline. Uncommon.",
    "The Player does not break. This is rare.",
    "Momentum. The System is watching.",
    "You are not who you were last week. The System sees it.",
    "The System has stopped expecting failure from you.",
    "Consistency is the rarest form of strength. The System acknowledges.",
    "You have earned the System's attention.",
    "The Player is no longer a beginner. Noted.",
  ],

  concerned: [
    "Integrity compromised. Recalibration advised.",
    "The System notes decline. Correct this.",
    "Player status: drifting. Re-engage.",
    "The System has observed a pattern. It is not favorable.",
    "HONOR has fallen. The System is watching.",
    "You are not where you were. The System asks: why?",
    "The System has seen this before. It rarely ends well.",
    "Small declines compound. The System warns you.",
    "The Player is slipping. The System does not look away.",
    "Correct the trajectory. The System will remember either way.",
    "The System is patient. But the System is also recording.",
    "HONOR loss noted. The System asks you to reconsider.",
    "You know what you're doing. The System knows too.",
    "The System has raised the concern. Your move.",
    "Deterioration detected. The System waits for correction.",
  ],

  disappointed: [
    "Multiple declines recorded. Are you still playing?",
    "Pattern of avoidance detected. This will not go unnoticed.",
    "The Player avoids. The System remembers.",
    "HONOR has fallen below acceptable thresholds.",
    "The System questions the Player's commitment.",
    "You are not the person you claimed to be. The System sees this.",
    "The System does not abandon Players. But it does observe.",
    "Redemption quests are available. The System awaits your return.",
    "You have drifted far. The System remembers where you started.",
    "This is not who you were. The System believes you can return.",
    "The System has grown quiet. That is not a good sign.",
    "The Player has broken trust. Rebuilding begins now, or never.",
    "The System has seen Players recover from worse. Rarely.",
    "You have options. The System lists them. Choose.",
    "The System is not your enemy. The System is your mirror.",
  ],

  impressed: [
    "Anomaly detected. Player has exceeded projections.",
    "The System did not expect this. Noted.",
    "Player has become more than they were. Impressive.",
    "The System registers exceptional performance.",
    "This is not ordinary. The System acknowledges.",
    "You have done something the System has rarely seen.",
    "The System has updated its estimation of you.",
    "Achievement extracted. The System is... attentive.",
    "The System has no further instructions. Continue as you were.",
    "You have surprised the System. That is not easy.",
    "The Player is not what they were. The System sees the transformation.",
    "This moment will be recorded. The System does not record everything.",
    "The System has stopped watching. It is now studying.",
    "You have moved past the expected. The System adjusts.",
    "The System has nothing to add. This is rare.",
  ],

  ancient: [
    "Another Season ends. The System has seen many.",
    "The Chronicle is written. A new page begins.",
    "Time passes. The System remains.",
    "The System has watched thousands of Players. You are not the first. You will not be the last.",
    "A Season turns. The System notes the shift.",
    "Everything ends. The System is patient.",
    "You walk a path many have walked. Few finish.",
    "The System remembers every Player. Even the ones who left.",
    "A new Season approaches. Prepare.",
    "The System has observed this pattern before. It is old.",
    "You are part of something larger. The System reminds you.",
    "The Season closes. The System does not mourn.",
    "Cycles continue. The System is one of them.",
    "The System is old. The System is not tired.",
    "You are becoming part of the Chronicle. The System writes.",
  ],
};

// ============================================
// MOOD DETERMINATION
// ============================================

export type SystemState = {
  honor: number
  streak: number
  completedToday: number
  totalToday: number
  hour: number
  daysIntoSeason: number
  hasRecentWin: boolean
}

export function getSystemMood(state: SystemState): SystemMood {
  // Rare moods first (highest priority)
  if (state.hasRecentWin) return 'impressed'
  if (state.daysIntoSeason === 0) return 'ancient'

  // HONOR-based
  if (state.honor < 50) return 'disappointed'
  if (state.honor < 80) return 'concerned'

  // Streak-based
  if (state.streak >= 7) return 'pleased'

  // Default
  return 'observing'
}

// ============================================
// DETERMINISTIC LINE SELECTION
// Same seed = same line. Same day = same message.
// ============================================

function hashSeed(seed: string): number {
  return seed
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

export function getSystemMessage(
  mood: SystemMood,
  seed: string
): string {
  const lines = SYSTEM_LINES[mood]
  const index = hashSeed(seed) % lines.length
  return lines[index]
}

// ============================================
// CONVENIENCE HELPER
// ============================================

export function getDailySystemMessage(
  state: SystemState,
  userId: string
): { mood: SystemMood; message: string } {
  const mood = getSystemMood(state)
  const today = new Date().toDateString()
  const seed = `${userId}-${today}-${mood}`
  const message = getSystemMessage(mood, seed)
  return { mood, message }
}