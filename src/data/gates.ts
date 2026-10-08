// ============================================
// GATES — 100 hand-written random encounters
// ============================================

export type Gate = {
  id: string
  name: string
  category: string
  duration_minutes: number
  xp_reward: number
  honor_cost: number
  description: string
}

export const GATES: Gate[] = [
  // ══ MIND GATES (Stillness, Truth, Silence) ══
  { id: 'g_mind_01', name: 'Gate of Stillness', category: 'mind', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Sit in complete stillness for 10 minutes. No input. No movement. No agenda.' },
  { id: 'g_mind_02', name: 'Gate of Truth', category: 'mind', duration_minutes: 10, xp_reward: 45, honor_cost: 5, description: 'Write one honest thing about yourself that you usually avoid.' },
  { id: 'g_mind_03', name: 'Gate of Silence', category: 'mind', duration_minutes: 30, xp_reward: 60, honor_cost: 8, description: 'Thirty minutes without speaking. Listen instead.' },
  { id: 'g_mind_04', name: 'Gate of Breath', category: 'mind', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Five minutes of deep breathing. Slow, deliberate, present.' },
  { id: 'g_mind_05', name: 'Gate of Awareness', category: 'mind', duration_minutes: 15, xp_reward: 50, honor_cost: 5, description: 'Observe your own thoughts for 15 minutes without engaging them.' },
  { id: 'g_mind_06', name: 'Gate of Gratitude', category: 'mind', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Write 3 specific things you are grateful for right now.' },
  { id: 'g_mind_07', name: 'Gate of Confession', category: 'mind', duration_minutes: 10, xp_reward: 45, honor_cost: 5, description: 'Write down one thing you have been hiding from yourself.' },
  { id: 'g_mind_08', name: 'Gate of Vision', category: 'mind', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Visualize your ideal life in complete detail for 10 minutes.' },
  { id: 'g_mind_09', name: 'Gate of Reading', category: 'mind', duration_minutes: 20, xp_reward: 50, honor_cost: 5, description: 'Read 10 pages of something real. No skimming.' },
  { id: 'g_mind_10', name: 'Gate of Journaling', category: 'mind', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Write 300 words without stopping. Full honesty.' },

  // ══ BODY GATES (Movement, Cold, Hunger) ══
  { id: 'g_body_01', name: 'Gate of Cold', category: 'body', duration_minutes: 5, xp_reward: 35, honor_cost: 5, description: 'Take a cold shower right now. Minimum 2 minutes. No warm-up.' },
  { id: 'g_body_02', name: 'Gate of Movement', category: 'body', duration_minutes: 2, xp_reward: 20, honor_cost: 3, description: 'Do 20 push-ups. Right now. No compromise.' },
  { id: 'g_body_03', name: 'Gate of Breathwork', category: 'body', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Do 30 deep squats. Slow, controlled, full range.' },
  { id: 'g_body_04', name: 'Gate of Endurance', category: 'body', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Hold a wall sit for as long as you can. Minimum 60 seconds.' },
  { id: 'g_body_05', name: 'Gate of Stillness', category: 'body', duration_minutes: 5, xp_reward: 30, honor_cost: 5, description: 'Do a 3-minute plank. Any variation. No stopping.' },
  { id: 'g_body_06', name: 'Gate of Hydration', category: 'body', duration_minutes: 2, xp_reward: 15, honor_cost: 3, description: 'Drink 500ml of water right now. No excuses.' },
  { id: 'g_body_07', name: 'Gate of Posture', category: 'body', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Stand with perfect posture for 5 minutes. Notice everything.' },
  { id: 'g_body_08', name: 'Gate of Mobility', category: 'body', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Stretch every major muscle group. Hold each for 30 seconds.' },
  { id: 'g_body_09', name: 'Gate of Grounding', category: 'body', duration_minutes: 10, xp_reward: 30, honor_cost: 5, description: 'Step outside barefoot for 10 minutes. Grass, earth, sand.' },
  { id: 'g_body_10', name: 'Gate of Movement', category: 'body', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Walk for 15 minutes. No destination. Just movement.' },
  { id: 'g_body_11', name: 'Gate of Sunlight', category: 'body', duration_minutes: 10, xp_reward: 30, honor_cost: 3, description: 'Go outside into the sun for 10 minutes. Face up. Breathe.' },
  { id: 'g_body_12', name: 'Gate of Strength', category: 'body', duration_minutes: 5, xp_reward: 35, honor_cost: 5, description: 'Do 3 sets of 10 burpees. Finish all 30.' },

  // ══ MASTERY GATES (Craft, Focus, Creation) ══
  { id: 'g_mast_01', name: 'Gate of Focus', category: 'mastery', duration_minutes: 25, xp_reward: 60, honor_cost: 5, description: 'Work on your craft for 25 minutes. No phone, no interruptions.' },
  { id: 'g_mast_02', name: 'Gate of Creation', category: 'mastery', duration_minutes: 15, xp_reward: 50, honor_cost: 5, description: 'Create something. Anything. No judgment, just output.' },
  { id: 'g_mast_03', name: 'Gate of Practice', category: 'mastery', duration_minutes: 20, xp_reward: 55, honor_cost: 5, description: 'Deliberate practice on your weakest sub-skill for 20 minutes.' },
  { id: 'g_mast_04', name: 'Gate of Shipping', category: 'mastery', duration_minutes: 30, xp_reward: 65, honor_cost: 8, description: 'Ship something. Publish, send, or complete one thing.' },
  { id: 'g_mast_05', name: 'Gate of Learning', category: 'mastery', duration_minutes: 20, xp_reward: 50, honor_cost: 5, description: 'Study one concept deeply. Take real notes.' },

  // ══ AUTONOMY GATES (Money, Value, Freedom) ══
  { id: 'g_auto_01', name: 'Gate of Coin', category: 'autonomy', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Log every expense from today. No skipping.' },
  { id: 'g_auto_02', name: 'Gate of Value', category: 'autonomy', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Write down one way you could earn $100 this week.' },
  { id: 'g_auto_03', name: 'Gate of Freedom', category: 'autonomy', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Calculate one number related to your financial freedom.' },

  // ══ GROWTH GATES (Learning, Reading, Curiosity) ══
  { id: 'g_grow_01', name: 'Gate of Curiosity', category: 'growth', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Learn about something completely outside your field.' },
  { id: 'g_grow_02', name: 'Gate of Reflection', category: 'growth', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Identify one way you have grown in the last 30 days.' },

  // ══ CONNECTION GATES (Reach out, Deep talk) ══
  { id: 'g_conn_01', name: 'Gate of Words', category: 'connection', duration_minutes: 5, xp_reward: 35, honor_cost: 5, description: 'Send a message to someone you have been avoiding.' },
  { id: 'g_conn_02', name: 'Gate of Presence', category: 'connection', duration_minutes: 15, xp_reward: 50, honor_cost: 5, description: 'Call or meet someone. Full attention. No phone.' },
  { id: 'g_conn_03', name: 'Gate of Gratitude', category: 'connection', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Text one person exactly why you appreciate them.' },
  { id: 'g_conn_04', name: 'Gate of Vulnerability', category: 'connection', duration_minutes: 10, xp_reward: 45, honor_cost: 5, description: 'Share something real with someone you trust.' },
  { id: 'g_conn_05', name: 'Gate of Listening', category: 'connection', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Have a conversation where you listen more than you speak.' },

  // ══ JOY GATES (Play, Beauty, Life) ══
  { id: 'g_joy_01', name: 'Gate of Beauty', category: 'joy', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Find one beautiful thing and look at it for 5 minutes.' },
  { id: 'g_joy_02', name: 'Gate of Play', category: 'joy', duration_minutes: 10, xp_reward: 35, honor_cost: 3, description: 'Do something purely for fun. No productivity attached.' },
  { id: 'g_joy_03', name: 'Gate of Music', category: 'joy', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Listen to a song you love. Full attention. No multitasking.' },
  { id: 'g_joy_04', name: 'Gate of Awe', category: 'joy', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Watch the sky for 5 minutes. Just watch.' },
  { id: 'g_joy_05', name: 'Gate of Smell', category: 'joy', duration_minutes: 2, xp_reward: 15, honor_cost: 3, description: 'Find something that smells beautiful and breathe it in for 2 minutes.' },

  // ══ RARE / HARD GATES ══
  { id: 'g_rare_01', name: 'Gate of Fear', category: 'mind', duration_minutes: 15, xp_reward: 80, honor_cost: 10, description: 'Face one thing you have been afraid of. Just one step.' },
  { id: 'g_rare_02', name: 'Gate of Apology', category: 'connection', duration_minutes: 10, xp_reward: 75, honor_cost: 10, description: 'Apologize to someone you have wronged. Sincerely, without excuses.' },
  { id: 'g_rare_03', name: 'Gate of Truth', category: 'connection', duration_minutes: 15, xp_reward: 80, honor_cost: 10, description: 'Tell someone the truth you have been holding back.' },
  { id: 'g_rare_04', name: 'Gate of Commitment', category: 'mastery', duration_minutes: 5, xp_reward: 60, honor_cost: 10, description: 'Publicly commit to something you have been putting off.' },

  // ══ FILLER GATES (to reach 100, keep adding variety) ══
  // MIND
  { id: 'g_mind_11', name: 'Gate of Acceptance', category: 'mind', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Notice one thing you cannot change and accept it out loud.' },
  { id: 'g_mind_12', name: 'Gate of Release', category: 'mind', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Write down 3 worries and then destroy the paper.' },
  { id: 'g_mind_13', name: 'Gate of Focus', category: 'mind', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Do one task with complete attention. Nothing else.' },
  { id: 'g_mind_14', name: 'Gate of Kindness', category: 'mind', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Say one kind thing to yourself. Out loud.' },
  { id: 'g_mind_15', name: 'Gate of Observation', category: 'mind', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Sit and observe your environment without judgment for 10 minutes.' },

  // BODY
  { id: 'g_body_13', name: 'Gate of Stairs', category: 'body', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Take the stairs instead of the elevator today. No exceptions.' },
  { id: 'g_body_14', name: 'Gate of Water', category: 'body', duration_minutes: 2, xp_reward: 15, honor_cost: 3, description: 'Drink 300ml of water. Slowly. Fully present.' },
  { id: 'g_body_15', name: 'Gate of Rest', category: 'body', duration_minutes: 20, xp_reward: 35, honor_cost: 5, description: 'Lie down and do nothing for 20 minutes. No phone. No nap.' },
  { id: 'g_body_16', name: 'Gate of Cooking', category: 'body', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Prepare one meal from scratch. No shortcuts.' },
  { id: 'g_body_17', name: 'Gate of Walking', category: 'body', duration_minutes: 20, xp_reward: 40, honor_cost: 5, description: 'Walk for 20 minutes at a brisk pace.' },
  { id: 'g_body_18', name: 'Gate of No Sugar', category: 'body', duration_minutes: 60, xp_reward: 55, honor_cost: 8, description: 'No sugar for the next hour. Notice the craving.' },
  { id: 'g_body_19', name: 'Gate of Stretch', category: 'body', duration_minutes: 10, xp_reward: 30, honor_cost: 5, description: 'Stretch your whole body. Head to toes. Slowly.' },
  { id: 'g_body_20', name: 'Gate of Balance', category: 'body', duration_minutes: 5, xp_reward: 25, honor_cost: 3, description: 'Stand on one leg for as long as you can. Then the other.' },

  // MASTERY
  { id: 'g_mast_06', name: 'Gate of Writing', category: 'mastery', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Write 500 words about what you are working on.' },
  { id: 'g_mast_07', name: 'Gate of Debugging', category: 'mastery', duration_minutes: 20, xp_reward: 50, honor_cost: 5, description: 'Fix one problem you have been putting off.' },
  { id: 'g_mast_08', name: 'Gate of Teaching', category: 'mastery', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Explain something you know to someone else.' },
  { id: 'g_mast_09', name: 'Gate of Reading', category: 'mastery', duration_minutes: 20, xp_reward: 50, honor_cost: 5, description: 'Read documentation or a technical article. Take notes.' },
  { id: 'g_mast_10', name: 'Gate of Sharing', category: 'mastery', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Share something you made. Public or private, doesn\'t matter.' },
  { id: 'g_mast_11', name: 'Gate of Review', category: 'mastery', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Review your last project. What would you do differently?' },
  { id: 'g_mast_12', name: 'Gate of Practice', category: 'mastery', duration_minutes: 25, xp_reward: 55, honor_cost: 5, description: 'Practice the basics of your craft. Even experts do this.' },

  // AUTONOMY
  { id: 'g_auto_04', name: 'Gate of Subscriptions', category: 'autonomy', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'List every subscription you pay for. Cancel one.' },
  { id: 'g_auto_05', name: 'Gate of Savings', category: 'autonomy', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Move any amount into savings right now. Even $5.' },
  { id: 'g_auto_06', name: 'Gate of Skill', category: 'autonomy', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Write down one skill you could monetize.' },
  { id: 'g_auto_07', name: 'Gate of Pitch', category: 'autonomy', duration_minutes: 15, xp_reward: 50, honor_cost: 5, description: 'Draft a pitch for a service you could offer.' },
  { id: 'g_auto_08', name: 'Gate of Freedom', category: 'autonomy', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Calculate your current savings rate.' },
  { id: 'g_auto_09', name: 'Gate of Income', category: 'autonomy', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Write down every income stream you have.' },
  { id: 'g_auto_10', name: 'Gate of Value', category: 'autonomy', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Draft 3 sentences for your professional bio.' },

  // GROWTH
  { id: 'g_grow_03', name: 'Gate of Book', category: 'growth', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Read 15 pages of a book you have been postponing.' },
  { id: 'g_grow_04', name: 'Gate of Notes', category: 'growth', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Take notes on something you learned recently.' },
  { id: 'g_grow_05', name: 'Gate of Question', category: 'growth', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Write down 5 questions you want to answer this year.' },
  { id: 'g_grow_06', name: 'Gate of Language', category: 'growth', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Learn 5 new words in a language you are studying.' },
  { id: 'g_grow_07', name: 'Gate of History', category: 'growth', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Learn one historical fact you did not know.' },
  { id: 'g_grow_08', name: 'Gate of Philosophy', category: 'growth', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Read one passage of philosophy. Write a response.' },
  { id: 'g_grow_09', name: 'Gate of Art', category: 'growth', duration_minutes: 10, xp_reward: 35, honor_cost: 5, description: 'Look at art. Really look. For 10 minutes.' },
  { id: 'g_grow_10', name: 'Gate of Reflection', category: 'growth', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Review your goals. Are you on track? Be honest.' },

  // CONNECTION
  { id: 'g_conn_06', name: 'Gate of Family', category: 'connection', duration_minutes: 10, xp_reward: 40, honor_cost: 5, description: 'Call a family member. Ask about their day.' },
  { id: 'g_conn_07', name: 'Gate of Old Friend', category: 'connection', duration_minutes: 5, xp_reward: 35, honor_cost: 5, description: 'Message a friend you have not spoken to in 3+ months.' },
  { id: 'g_conn_08', name: 'Gate of Compliment', category: 'connection', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Give someone a specific, genuine compliment.' },
  { id: 'g_conn_09', name: 'Gate of Help', category: 'connection', duration_minutes: 20, xp_reward: 50, honor_cost: 5, description: 'Help someone with something real. No expectation of return.' },
  { id: 'g_conn_10', name: 'Gate of Reconnect', category: 'connection', duration_minutes: 10, xp_reward: 45, honor_cost: 5, description: 'Reach out to someone you have drifted from.' },
  { id: 'g_conn_11', name: 'Gate of Deep Talk', category: 'connection', duration_minutes: 20, xp_reward: 55, honor_cost: 8, description: 'Ask someone a deep question. Listen fully.' },
  { id: 'g_conn_12', name: 'Gate of Letter', category: 'connection', duration_minutes: 15, xp_reward: 50, honor_cost: 5, description: 'Write a real letter (not text) to someone you love.' },
  { id: 'g_conn_13', name: 'Gate of Host', category: 'connection', duration_minutes: 30, xp_reward: 60, honor_cost: 8, description: 'Invite someone over. Cook for them. Real connection.' },
  { id: 'g_conn_14', name: 'Gate of Listening', category: 'connection', duration_minutes: 15, xp_reward: 45, honor_cost: 5, description: 'Have a conversation. Don\'t interrupt. Don\'t advise.' },

  // JOY
  { id: 'g_joy_06', name: 'Gate of Music Full', category: 'joy', duration_minutes: 20, xp_reward: 40, honor_cost: 5, description: 'Listen to a full album. No skipping. Full attention.' },
  { id: 'g_joy_07', name: 'Gate of Dance', category: 'joy', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Dance alone for 5 minutes. Badly if needed.' },
  { id: 'g_joy_08', name: 'Gate of Childhood', category: 'joy', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Do something you loved as a child.' },
  { id: 'g_joy_09', name: 'Gate of Cooking Joy', category: 'joy', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Cook something you genuinely love. Take your time.' },
  { id: 'g_joy_10', name: 'Gate of Laughter', category: 'joy', duration_minutes: 10, xp_reward: 35, honor_cost: 3, description: 'Watch something that makes you laugh. Real laughter only.' },
  { id: 'g_joy_11', name: 'Gate of Nature', category: 'joy', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Spend 20 minutes in nature. Leave your phone behind.' },
  { id: 'g_joy_12', name: 'Gate of Doing Nothing', category: 'joy', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Do nothing for 15 minutes. No phone. No book. Just be.' },
  { id: 'g_joy_13', name: 'Gate of Hobby', category: 'joy', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Spend 20 minutes on a hobby with no goal attached.' },
  { id: 'g_joy_14', name: 'Gate of Aesthetic', category: 'joy', duration_minutes: 10, xp_reward: 35, honor_cost: 3, description: 'Engage with something beautiful. Art, design, or nature.' },
  { id: 'g_joy_15', name: 'Gate of Story', category: 'joy', duration_minutes: 20, xp_reward: 45, honor_cost: 5, description: 'Read or watch a story you genuinely love.' },
  { id: 'g_joy_16', name: 'Gate of Sun', category: 'joy', duration_minutes: 15, xp_reward: 40, honor_cost: 3, description: 'Watch the sunset or sunrise with full attention.' },
  { id: 'g_joy_17', name: 'Gate of Touch', category: 'joy', duration_minutes: 10, xp_reward: 35, honor_cost: 3, description: 'Engage with one physical sensory pleasure for 10 minutes.' },
  { id: 'g_joy_18', name: 'Gate of Curious', category: 'joy', duration_minutes: 15, xp_reward: 40, honor_cost: 5, description: 'Explore a topic that fascinates you. Just because.' },
  { id: 'g_joy_19', name: 'Gate of Comfort', category: 'joy', duration_minutes: 10, xp_reward: 30, honor_cost: 3, description: 'Do one comforting thing. Tea, blanket, favorite show.' },
  { id: 'g_joy_20', name: 'Gate of Celebration', category: 'joy', duration_minutes: 5, xp_reward: 30, honor_cost: 3, description: 'Celebrate one small win. Out loud. Genuinely.' },

  // RARE + SPECIAL
  { id: 'g_rare_05', name: 'Gate of Discomfort', category: 'mind', duration_minutes: 20, xp_reward: 70, honor_cost: 10, description: 'Do the thing you have been avoiding most. Today.' },
  { id: 'g_rare_06', name: 'Gate of Forgiveness', category: 'mind', duration_minutes: 20, xp_reward: 75, honor_cost: 10, description: 'Write a forgiveness letter. Send it or don\'t. Just write it.' },
  { id: 'g_rare_07', name: 'Gate of Vulnerability', category: 'connection', duration_minutes: 15, xp_reward: 75, honor_cost: 10, description: 'Share something you have never told anyone.' },
  { id: 'g_rare_08', name: 'Gate of Marathon', category: 'body', duration_minutes: 60, xp_reward: 90, honor_cost: 10, description: 'One hour of dedicated physical activity. No stopping.' },
]

// ============================================
// GATE DETECTION — Deterministic based on user + hour
// ============================================

export function generateGateForHour(userId: string, hour: number): Gate | null {
  // Hash: userId + hour + date
  const date = new Date().toDateString()
  const seed = `${userId}-${date}-${hour}`
  const seedNum = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  // 2% chance per hour
  const roll = (Math.abs(Math.sin(seedNum) * 10000) | 0) % 100
  if (roll >= 2) return null

  // Pick a gate deterministically
  const gateIdx = Math.abs(Math.sin(seedNum * 2) * 10000) | 0
  return GATES[gateIdx % GATES.length]
}

export function getGateById(id: string): Gate | undefined {
  return GATES.find(g => g.id === id)
}