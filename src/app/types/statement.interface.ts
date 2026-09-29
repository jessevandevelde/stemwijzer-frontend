import type { Answer } from './answer.interface';

export interface Statement {
  readonly id: number
  readonly text: string
  readonly isActive: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

export interface PartyAnswer {
  readonly partyId: number
  readonly partyName: string
  readonly answer: Answer | null
}

export interface PublicStatement {
  readonly index: number
  readonly id: number
  readonly text: string
  readonly partyAnswers: readonly PartyAnswer[]
}
