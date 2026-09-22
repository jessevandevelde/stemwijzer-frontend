export interface Party {
  readonly id: string
  readonly name: string
  readonly abbreviation: string
  readonly leaderName: string
  readonly currentSeats: number
  readonly answeredStatementCount: number
  readonly totalStatementCount: number
}
