export type QuestionType = 'scale' | 'yn' | 'multi' | 'text' | 'single'
 
export interface Conditional {
  parent: string
  value?: string | number
  minValue?: number
}
 
export interface Question {
  id: string
  text: string
  sub: string | null
  type: QuestionType
  low?: string
  high?: string
  conditional?: Conditional
  options?: string[]
  placeholder?: string
  isDemographic?: boolean;
  scoringWeight?: number;
}
 
export interface Section {
  title: string
  subtitle?: string
  questions: Question[]
}
 
export type Answers = Record<string, number | string | number[]>