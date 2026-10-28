import type { Answer } from './answer.interface';

export interface AnswerSubmission {
  readonly statementId: number
  readonly answer: Answer
}

export interface PartyMatch {
  readonly partyId: number
  readonly partyName: string
  readonly matchPercentage: number | null
  readonly matchedAnswers: number
  readonly comparedAnswers: number
  readonly missingAnswers: number
  readonly economicPosition: number
  readonly culturalPosition: number
}

export interface SpectrumPosition {
  readonly economicPosition: number
  readonly culturalPosition: number
}

export interface MatchingResult {
  readonly totalAnswers: number
  readonly matches: readonly PartyMatch[]
  readonly userPosition: SpectrumPosition
}

export interface AnswerSummary {
  readonly agree: number
  readonly neutral: number
  readonly disagree: number
  readonly skipped: number
  readonly total: number
}
