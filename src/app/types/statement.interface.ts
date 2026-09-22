export const STATEMENT_CATEGORIES = [
  'Klimaat & Energie',
  'Wonen & Bouwen',
  'Gezondheidszorg',
  'Migratie & Asiel',
  'Financiën & Economie',
  'Onderwijs',
  'Veiligheid & Justitie',
  'Bestuur & Democratie',
] as const;

export type StatementCategory = typeof STATEMENT_CATEGORIES[number];

export interface Statement {
  readonly id: string
  readonly number: number
  readonly text: string
  readonly category: StatementCategory
}
