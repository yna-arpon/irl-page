import type { Section } from '../types'

export const SECTIONS: Section[] = [
  {
    title: 'Your habits',
    subtitle: 'A few questions about how you use your phone day-to-day.',
    questions: [
      {
        id: 'q1',
        text: 'How motivated are you to reduce your daily screen time?',
        sub: '1 = not even thinking about it. 5 = fully committed.',
        type: 'scale',
        low: 'Not at all', high: 'Fully committed',
      },
      {
        id: 'q2',
        text: 'You see a notification appear. How long can you genuinely wait before checking it?',
        sub: '1 = you already opened it while reading this question.',
        type: 'scale',
        low: 'Immediately', high: 'Hours later',
      },
      {
        id: 'q3',
        text: 'What typically triggers you to reach for your phone?',
        sub: 'Select all that apply.',
        type: 'multi',
        options: [
          'Boredom',
          'Anxiety or stress',
          'Loneliness',
          'Avoiding something',
          'Pure habit — no reason',
          'FOMO / checking in',
        ],
      },
      {
        id: 'q4',
        text: "There's a pause in a conversation. What do you do?",
        sub: '1 = reach for your phone. 5 = hold the silence.',
        type: 'scale',
        low: 'Reach for phone', high: 'Stay present',
      },
    ],
  },
  {
    title: 'Past attempts',
    subtitle: "We want to understand what's been tried — and what hasn't worked.",
    questions: [
      {
        id: 'q5',
        text: 'Have you tried to cut back on your phone use before?',
        sub: null,
        type: 'yn',
      },
      {
        id: 'q5a',
        text: 'What happened when you tried?',
        sub: 'Select all that apply.',
        type: 'multi',
        conditional: { parent: 'q5', value: 'yes' },
        options: [
          'Gave up after a few days',
          "It worked short-term but didn't stick",
          "App blockers didn't help",
          'Found myself on a different app instead',
          "Still going — but it's a struggle",
        ],
      },
      {
        id: 'q6',
        text: 'How committed are you to keeping your phone out of your bedroom entirely?',
        sub: "Doomscrolling to 2am while 'winding down' is still a 1.",
        type: 'scale',
        low: 'Never happening', high: 'Already doing it',
      },
    ],
  },
  {
    title: 'Impact on your life',
    subtitle: 'Help us understand what phone use actually costs you.',
    questions: [
      {
        id: 'q7',
        text: "Your algorithm knows your emotional state better than your closest friends. How okay are you with that?",
        sub: null,
        type: 'scale',
        low: 'Honestly fine', high: "That's a real problem",
      },
      {
        id: 'q8',
        text: 'How much does your phone use take away from your life?',
        sub: "0 = no impact at all. 10 = it's costing you things that matter.",
        type: 'scale10',
        low: 'No impact', high: 'Significant cost',
      },
      {
        id: 'q8a',
        text: 'What does it take away from?',
        sub: 'Be as specific as you like.',
        type: 'text',
        conditional: { parent: 'q8', minValue: 5 },
      },
      {
        id: 'q9',
        text: 'How willing are you to spend 60 uninterrupted minutes with zero screens of any kind?',
        sub: 'Phone, laptop, TV, watch — all of it. Gone. For one hour.',
        type: 'scale',
        low: 'That sounds awful', high: 'Done it today',
      },
    ],
  },
]