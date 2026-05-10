import type { Question } from '../types'

// Page 1 — just one question
export const PAGE_1_QUESTIONS: Question[] = [
  {
    id: 'p_numKids',
    text: 'How many kids do you want to fill this out for?',
    sub: null,
    type: 'single',
    options: ['1', '2', '3', '4', '5+'],
    isDemographic: true,
  },
]

// Page 2 — per-child questions (shown in accordions if >1 child)
// Questions p1-p11 map to the 11 per-child questions
export const PER_CHILD_QUESTIONS: Question[] = [
  {
    id: 'p1',
    text: "What age range is your child?",
    sub: null,
    type: 'single',
    options: ['Under 5', 'Ages 6-10', 'Ages 10-14', 'Ages 14-18', '18+'],
  },
  {
    id: 'p2',
    text: "What is their gender?",
    sub: null,
    type: 'single',
    options: ['Male', 'Female', 'Non-binary', 'Rather not share'],
  },
  {
    id: 'p3',
    text: "What is their approximate screen time per day?",
    sub: null,
    type: 'single',
    options: ['Under 3 hours', '3-6 hours', '6+ hours'],
  },
  {
    id: 'p4',
    text: "What do they spend most of their time doing on their phone?",
    sub: 'Select all that apply.',
    type: 'multi',
    options: [
      'Social media',
      'Connection (texting, calls, video chats)',
      'Education',
      'Games',
      'Entertainment',
      'Creativity',
      'Health & Fitness',
      'Homework',
      'Studying',
      'Other',
    ],
  },
  {
    id: 'p4a',
    text: "What other activities do they spend time on?",
    sub: 'You selected "Other" above.',
    type: 'text',
    placeholder: 'e.g. Shopping, news, etc.',
    conditional: { parent: 'p4', value: 9 },
  },
  {
    id: 'p5',
    text: "Do you feel your child's phone usage impacts their school or focus?",
    sub: '1 = Not at all, 5 = Significantly',
    type: 'scale',
    low: 'Not at all', high: 'Significantly',
  },
  {
    id: 'p6',
    text: "Do you feel your child's phone usage impacts their mental health?",
    sub: '1 = Not at all, 5 = Significantly',
    type: 'scale',
    low: 'Not at all', high: 'Significantly',
  },
  {
    id: 'p7',
    text: "Do you feel your child's phone usage impacts their sleep?",
    sub: '1 = Not at all, 5 = Significantly',
    type: 'scale',
    low: 'Not at all', high: 'Significantly',
  },
  {
    id: 'p8',
    text: "Do you feel your child's phone usage impacts their friendships or personal relationships?",
    sub: '1 = Not at all, 5 = Significantly',
    type: 'scale',
    low: 'Not at all', high: 'Significantly',
  },
  {
    id: 'p9',
    text: "Do you feel your child's phone usage impacts their behaviour?",
    sub: '1 = Not at all, 5 = Significantly',
    type: 'scale',
    low: 'Not at all', high: 'Significantly',
  },
  {
    id: 'p10',
    text: "How big of a problem is this for you overall?",
    sub: '1 = Not a problem, 5 = A serious concern',
    type: 'scale',
    low: 'Not a problem', high: 'Serious concern',
  },
]

// Page 3 — general questions (one answer, not per-child)
export const GENERAL_QUESTIONS: Question[] = [
  {
    id: 'g1',
    text: "Describe how phone usage is affecting your children's lives.",
    sub: null,
    type: 'text',
    placeholder: 'Share as much or as little as you like...',
  },
  {
    id: 'g2',
    text: "Do you currently use — or have you used — any methods to assist with screen time or phone usage?",
    sub: 'e.g. screen time apps, extracurricular activities, low-stimulation toys or screens',
    type: 'text',
    placeholder: 'e.g. Apple Screen Time, Opal, taking the phone away at bedtime...',
  },
  {
    id: 'g3',
    text: "What did you like about these tools?",
    sub: 'Select all that apply.',
    type: 'multi',
    options: [
      "It's easy to use",
      "It's effective",
      "It's tailored to my preferences and goals",
      "I can share progress with friends or family",
      "It shows me meaningful data about usage",
      "There are good rewards or perks",
      "Other",
      "N/A — I don't use anything",
    ],
  },
  {
    id: 'g3a',
    text: "What else did you like?",
    sub: 'You selected "Other" above.',
    type: 'text',
    placeholder: '',
    conditional: { parent: 'g3', value: 6 },
  },
  {
    id: 'g4',
    text: "What did you dislike about these tools?",
    sub: 'Select all that apply.',
    type: 'multi',
    options: [
      "It's too complex",
      "It's not intuitive",
      "It's too easy to override",
      "There's no accountability",
      "It's not suitable for my life or job",
      "Other",
      "N/A — I don't use anything",
    ],
  },
  {
    id: 'g4a',
    text: "What else did you dislike?",
    sub: 'You selected "Other" above.',
    type: 'text',
    placeholder: '',
    conditional: { parent: 'g4', value: 5 },
  },
  {
    id: 'g5',
    text: "What do you think would motivate your child to reduce their screen time?",
    sub: null,
    type: 'text',
    placeholder: 'e.g. treats, competing with siblings, earning privileges...',
  },
  {
    id: 'g6',
    text: "Would you be interested in helping us solve this problem?",
    sub: null,
    type: 'text',
    placeholder: 'Tell us how you\'d like to be involved — a quick chat, early access, feedback sessions...',
  },
]