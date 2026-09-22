import type { Party } from '../types/party.interface';

const TOTAL_STATEMENTS = 30;

export const PARTIES_DUMMY_DATA: readonly Party[] = [
  { id: 'pa-01', name: 'Partij voor de Vrijheid', abbreviation: 'PVV', leaderName: 'G. Wilders', currentSeats: 37, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-02', name: 'GroenLinks-PvdA', abbreviation: 'GL/PvdA', leaderName: 'F. Timmermans', currentSeats: 25, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-03', name: 'Volkspartij voor Vrijheid en Democratie', abbreviation: 'VVD', leaderName: 'D. Yesilgöz', currentSeats: 24, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-04', name: 'Nieuw Sociaal Contract', abbreviation: 'NSC', leaderName: 'P. Omtzigt', currentSeats: 20, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-05', name: 'Democraten 66', abbreviation: 'D66', leaderName: 'R. Jetten', currentSeats: 9, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-06', name: 'Christen-Democratisch Appèl', abbreviation: 'CDA', leaderName: 'H. Bontenbal', currentSeats: 5, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-07', name: 'Socialistische Partij', abbreviation: 'SP', leaderName: 'J. Marijnissen', currentSeats: 5, answeredStatementCount: 22, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-08', name: 'Forum voor Democratie', abbreviation: 'FvD', leaderName: 'T. Baudet', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-09', name: 'Partij voor de Dieren', abbreviation: 'PvdD', leaderName: 'E. Ouwehand', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-10', name: 'ChristenUnie', abbreviation: 'CU', leaderName: 'M. Bikker', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-11', name: 'Volt Nederland', abbreviation: 'Volt', leaderName: 'L. Dassen', currentSeats: 2, answeredStatementCount: 17, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-12', name: 'JA21', abbreviation: 'JA21', leaderName: 'J. Eerdmans', currentSeats: 1, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-13', name: 'Staatkundig Gereformeerde Partij', abbreviation: 'SGP', leaderName: 'C. Stoffer', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-14', name: 'DENK', abbreviation: 'DENK', leaderName: 'S. van Baarle', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-15', name: 'BoerBurgerBeweging', abbreviation: 'BBB', leaderName: 'C. van der Plas', currentSeats: 4, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-16', name: '50PLUS', abbreviation: '50PLUS', leaderName: 'M. Buijsse', currentSeats: 0, answeredStatementCount: 0, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-17', name: 'Belang van Nederland', abbreviation: 'BVNL', leaderName: 'W. van Haga', currentSeats: 0, answeredStatementCount: 9, totalStatementCount: TOTAL_STATEMENTS },
  { id: 'pa-18', name: 'Nieuw Links', abbreviation: 'NL', leaderName: 'A. Kuiper', currentSeats: 3, answeredStatementCount: 30, totalStatementCount: TOTAL_STATEMENTS },
];
