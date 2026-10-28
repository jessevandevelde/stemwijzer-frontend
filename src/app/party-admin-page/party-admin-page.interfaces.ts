import type { Answer } from '../types/answer.interface';

export interface PartyStatementAnswer {
  readonly statementId: number
  readonly text: string
  readonly answer: Answer | null
}

export interface PartyStatementsResponse {
  readonly party: { readonly id: number, readonly name: string }
  readonly statements: readonly PartyStatementAnswer[]
}
