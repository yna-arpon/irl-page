import type { Section } from '../types'

export const SECTIONS: Section[] = [
  {
    title: 'About you',
    // subtitle: 'A few questions about how you use your phone day-to-day.',
    questions: [
      {
        id: 'q1',
        text: 'Please select your age from the ranges below',
        sub: null,
        type: 'single',
        options: [
          'Under 18',
          '18-24',
          '25-40',
          '40+',
        ],
        isDemographic: true,
      },
      {
        id: 'q2',
        text: 'What is your occupation?',
        sub: null,
        type: 'single',
        options: [
          'Student',
          'Employed',
          'Retired',
          'None of the above'
        ],
        isDemographic: true,
      },
      {
        id: 'q2a',
        text: 'What do you do for work?',
        sub: 'If you selected "Employed" above, please share a bit about your job (optional).',
        type: 'text',
        placeholder: 'e.g., Software engineering intern, Barista, Technician, etc.',
        conditional: { parent: 'q2', value: 1 },
        isDemographic: true,
      },
      {
        id: 'q3',
        text: 'What is your gender?',
        sub: null,
        type: 'single',
        options: [
          'Male',
          'Female',
          'Non-binary',
          'Prefer not to say'
        ],
        isDemographic: true,
      },
    ],
  },
  {
    title: 'The Screen\'s Impact',
    subtitle: "We want to understand what's been tried — and what hasn't worked.",
    questions: [
      {
        id: 'q4',
        text: 'What is your average daily screen time?',
        sub: 'Don\'t worry, we won\'t judge.',
        type: 'single',
        options: [
          'Under 3 hours',
          '3-6 hours',
          'More than 6 hours',
        ],
      },
      {
        id: 'q5',
        text: 'What do you spend most of your time doing on your phone?',
        sub: 'Select all that apply.',
        type: 'multi',
        options: [
          'Social media',
          'Connection (e.g., texting, calls, video chats)',
          'Education',
          'Games',
          'Entertainment',
          'Creativity',
          'Health and Fitness',
          'Other',
        ],
      },
      {
        id: 'q5a',
        text: 'What other activities do you spend time on?',
        sub: 'If you selected "Other" above, please share what else you use your phone for (optional).',
        type: 'text',
        placeholder: 'e.g., Shopping, Work, News, etc.',
        conditional: { parent: 'q5', value: 7 },
      },
      {
        id: 'q6',
        text: 'Which applications take up most of your time?',
        sub: "Select all that apply.",
        type: 'multi',
        options: [
          'Instagram',
          'TikTok',
          'YouTube',
          'Snapchat',
          'X (Twitter)',
          'Facebook',
          'LinkedIn',
          'Reddit',
          'Other',
        ],
      },
      {
        id: 'q6a',
        text: 'What other applications do you love using?',
        sub: 'If you selected "Other" above, please share what applications you use your phone for (optional).',
        type: 'text',
        placeholder: 'e.g., Pinterest, Outlook, iMessage, etc.',
        conditional: { parent: 'q6', value: 8 },
      },
      {
        id: 'q7',
        text: 'Do you use your phone for work?',
        sub: null,
        type: 'yn',
      },
      {
        id: 'q8',
        text: 'What typically triggers you to reach for your phone?',
        sub: 'Select all that apply.',
        type: 'multi',
        options: [
          'Anxiety',
          'Boredom',
          'Procrastination',
          'Entertainment',
          'Loneliness',
          'Work',
          'Habit',
          'Other',
        ],
      },
      {
        id: 'q8a',
        text: 'What triggers you to reach for your phone?',
        sub: 'If you selected "Other" above, please share what typically triggers you to reach for your phone (optional).',
        type: 'text',
        placeholder: 'e.g., Text messages, etc.',
        conditional: { parent: 'q8', value: 7},
      },
      {
        id: 'q9',
        text: 'I feel like my phone usage harms my ability to focus',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q10',
        text: 'I feel like my phone usage harms my performance at work or school',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q11',
        text: 'I feel like my phone usage harms my sleep',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q12',
        text: 'I feel like my phone usage harms my personal relationships',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q13',
        text: 'I feel like my phone usage harms my mental health',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q14',
        text: 'I feel like my phone usage harms my physical health',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q15',
        text: 'I feel anxious when I don\'t have my phone',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q16',
        text: 'I am motivated to reduce my screen time',
        sub: 'Rank the statement above',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q17',
        text: 'Do you use any tools to assist with your screent time?',
        sub: null,
        type: 'multi',
        options: [
          'Apple Screen Time / Google Wellness',
          'Opal',
          'ScreenZen',
          'OneSec',
          "I don't use anything",
          'Other',
        ]
      },
      {
        id: 'q17a',
        text: 'What do you use to assist with your screen time?',
        sub: 'If you selected "Other" above, please share what tools you use (optional).',
        type: 'text',
        placeholder: 'e.g., Placing my phone in another room, etc.',
        conditional: { parent: 'q17', value: 5},
      }
    ],
  },
]

export const BONUS_SECTION: Section[] = [
  {
    title: 'Deep Dive',
    subtitle: '',
    questions: [
      {
        id: 'b1',
        text: 'What do you like about your current tools?',
        sub: null,
        type: 'multi',
        options: [
          "It's easy to use",
          "It's effective",
          "It's tailored to my preferences and goals",
          "I can share progress with friends or family to keep me accountable",
          "It shows me meaningful data about my phone usage",
          "There are good rewards or perks",
          "N/A - I don't use anything",
          'Other'
        ]
      },
      {
        id: 'b1a',
        text: 'What else do you like about your current tools?',
        sub: 'If you selected "Other" above, please share what other features you like about your current tools (optional).',
        type: 'text',
        placeholder: '',
        conditional: { parent: 'b1', value: 7 },
      },
      {
        id: 'b2',
        text: 'What do you dislike about your current tools?',
        sub: null,
        type: 'multi',
        options: [
          "It's too complex",
          "It's too easy to override",
          "There's no accountability",
          "It's not suitable for my life or job",
          "It's too complex",
          "N/A - I don't use anything",
          'Other'
        ]
      },
      {
        id: 'b2a',
        text: 'What else do you dislike about your current tools?',
        sub: 'If you selected "Other" above, please share what else you do not like about your current tools (optional).',
        type: 'text',
        placeholder: '',
        conditional: { parent: 'b2', value: 6 },
      },
      {
        id: 'b3',
        text: 'What tools do you feel would help you cut down on screen time?',
        sub: 'Be as specific as you like.',
        type: 'multi',
        options: [
          'App blockers',
          'Screen time limits',
          'Shared progress or accountability with friends',
          'Progress (streaks)', 
          'Analytics/data',
          'Rewards & Perks',
          'Redirecting you to tasks away from your phone',
          "N/A - I'm not interested in using any tools",
          'Other'
        ]
      },
      {
        id: 'b3a',
        text: 'What other tools do you feel would help you cut down on screen time?',
        sub: 'If you selected "Other" above, please share what else you feel would help you (optional).',
        type: 'text',
        placeholder: '',
        conditional: { parent: 'b3', value: 7 },
      },
    ]
  }
]