# irl Survey

```
src/
├── types.ts                          # Shared TS types (Question, Section, Answers)
├── App.tsx                           # Root — survey form → thank-you screen
│
├── data/
│   └── questions.ts                  # SECTIONS array — edit questions/copy here
│
├── utils/
│   └── airtable.ts                   # postToAirtable() — swap if backend changes
│
└── components/
    ├── inputs/
    │   └── index.tsx                 # ScaleInput, Scale10Input, TextInput, YNInput, MultiInput
    ├── QuestionCard.tsx              # Renders one question with conditional visibility
    ├── SurveyForm/
    │   └── index.tsx                 # Paginated form with prev/next navigation
    └── LeadCapture/
        └── index.tsx                 # ThankYouScreen with contact opt-in checkbox
```

## Survey flow

1. **Section 1 — Your habits** (4 questions)
2. **Section 2 — Past attempts** (3 questions, one conditional)
3. **Section 3 — Impact on your life** (4 questions, one conditional)
4. **Final screen** — optional contact opt-in → submits to Airtable

## Adding or reordering sections

Edit `src/data/questions.ts`. Each `Section` has a `title`, optional `subtitle`, and a `questions` array. Questions with a `conditional` field only appear when the parent answer matches.

## Airtable fields submitted

| Field          | Value                                   |
| -------------- | --------------------------------------- |
| `Name`         | Name if provided, else `(not provided)` |
| `Email`        | Email if opted in, else `(opted out)`   |
| `WantsContact` | boolean                                 |
| `Answers`      | Pipe-separated `id: value` string       |
