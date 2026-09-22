import type { StatementCategory } from '../types/statement.interface';

export const ALL_CATEGORIES_OPTION = 'Alle categorieën';

export interface StatementListFilters {
  readonly search: string
  readonly category: string
}

export interface PartyListFilters {
  readonly search: string
}

export interface StatementFormValue {
  readonly text: string
  readonly category: StatementCategory
}

export interface PartyFormValue {
  readonly name: string
  readonly abbreviation: string
  readonly leaderName: string
  readonly currentSeats: number
}
