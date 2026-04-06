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
          'Funemployed',
          'Retired',
        ],
        isDemographic: true,
      },
      {
        id: 'q2a',
        text: 'What do you do for work?',
        sub: 'If you selected "Employed" above, please share a bit about your job.',
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
          'Connection (texting, calls, video chats)',
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
        sub: 'If you selected "Other" above, please share what else you use your phone for.',
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
        sub: 'If you selected "Other" above, please share what applications you use your phone for.',
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
          'Boredom',
          'Stress or anxiety',
          'Procrastination',
          'Loneliness',
          'Habit',
          'Work/Notifications',
          'Other',
        ],
      },
      {
        id: 'q8a',
        text: 'What triggers you to reach for your phone?',
        sub: 'If you selected "Other" above, please share what typically triggers you to reach for your phone.',
        type: 'text',
        placeholder: 'e.g., Text messages, etc.',
        conditional: { parent: 'q8', value: 6},
      },
      {
        id: 'q9',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my ability to focus',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q10',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my work or school performance',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q11',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my sleep',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q12',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my personal relationships',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q13',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my mental health',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q14',
        text: 'Rank the following statement:',
        sub: 'I feel like my phone usage harms my physical health',
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q15',
        text: 'I feel anxious when I don\'t have my phone',
        sub: null,
        type: 'scale',
        low: 'Strongly disagree', high: 'Strongly agree',
      },
      {
        id: 'q16',
        text: 'I am motivated to reduce my screen time',
        sub: null,
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
          'Other',
        ]
      },
      {
        id: 'q17a',
        text: 'What do you use to track your screen time?',
        sub: 'If you selected "Other" above, please share what tools you use.',
        type: 'text',
        placeholder: 'e.g., Placing my phone in another room, etc.',
        conditional: { parent: 'q17', value: 4},
      }
    ],
  },
]

export const BONUS_SECTION: Section[] = [
  {
    title: 'Deep Dive',
    subtitle: 'Since you scored high on the previous questions, we\'d love to understand more about your experience.',
    questions: [
      {
        id: 'b1',
        text: 'What do you like about your current tools?',
        sub: null,
        type: 'multi',
        options: [
          'They\'re easy to use',
          'They provide good insights',
          'They help me stay accountable',
          'Other'
        ]
      },
      {
        id: 'b2',
        text: 'What don\'t you like about your current tools?',
        sub: null,
        type: 'multi',
        options: [
          'They\'re hard to use',
          'They don\'t provide good insights',
          'They don\'t help me stay accountable',
          'Other'
        ]
      },
      {
        id: 'b3',
        text: 'What tools do you feel would help you cut down on screen time?',
        sub: 'Be as specific as you like.',
        type: 'multi',
        options: [
          'App blockers',
          'Screen time limits',
          'Shared progress or accountability with friends'
        ]
      },
      {
        id: 'b4',
        text: 'If you could wave a magic wand and change anything about your phone usage, what would it be?',
        sub: 'Be as specific as you like.',
        type: 'text',
      }
    ]
  }
]