import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { PARTIES_DUMMY_DATA } from '../dummy-data/parties.dummy';
import { STATEMENTS_DUMMY_DATA } from '../dummy-data/statements.dummy';
import type { DashboardMetrics, PaginatedResult } from '../types/admin.interface';
import type { Party } from '../types/party.interface';
import type { Statement, StatementCategory } from '../types/statement.interface';
import { STATEMENT_CATEGORIES } from '../types/statement.interface';
import type { PartyFormValue, PartyListFilters, StatementFormValue, StatementListFilters } from './admin-page.interfaces';
import { ALL_CATEGORIES_OPTION } from './admin-page.interfaces';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function paginate<T>(items: readonly T[], page: number, pageSize: number): PaginatedResult<T> {
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminPageService {
  private statements: Statement[] = [...STATEMENTS_DUMMY_DATA];

  private parties: Party[] = [...PARTIES_DUMMY_DATA];

  public getCategories(): readonly StatementCategory[] {
    return STATEMENT_CATEGORIES;
  }

  public getDashboardMetrics(): Observable<DashboardMetrics> {
    return of({
      activeStatementCount: this.statements.length,
      registeredPartyCount: this.parties.length,
    });
  }

  public getStatements(filters: StatementListFilters, page: number, pageSize: number): Observable<PaginatedResult<Statement>> {
    const search = normalize(filters.search);

    const filtered = this.statements.filter((statement) => {
      const matchesSearch = search === '' || normalize(statement.text).includes(search) || String(statement.number).includes(search);
      const matchesCategory = filters.category === ALL_CATEGORIES_OPTION || statement.category === filters.category;

      return matchesSearch && matchesCategory;
    });

    return of(paginate(filtered, page, pageSize));
  }

  public getStatement(id: string): Observable<Statement | undefined> {
    return of(this.statements.find(statement => statement.id === id));
  }

  public createStatement(value: StatementFormValue): Observable<Statement> {
    const nextNumber = this.statements.reduce((highest, statement) => Math.max(highest, statement.number), 0) + 1;

    const created: Statement = {
      id: crypto.randomUUID(),
      number: nextNumber,
      text: value.text,
      category: value.category,
    };

    this.statements = [...this.statements, created];

    return of(created);
  }

  public updateStatement(id: string, value: StatementFormValue): Observable<Statement | undefined> {
    let updated: Statement | undefined = undefined;

    this.statements = this.statements.map((statement) => {
      if (statement.id !== id) {
        return statement;
      }

      updated = { ...statement, text: value.text, category: value.category };

      return updated;
    });

    return of(updated);
  }

  public deleteStatement(id: string): Observable<void> {
    this.statements = this.statements.filter(statement => statement.id !== id);

    return of(undefined);
  }

  public getParties(filters: PartyListFilters, page: number, pageSize: number): Observable<PaginatedResult<Party>> {
    const search = normalize(filters.search);

    const filtered = this.parties.filter(party => search === ''
      || normalize(party.name).includes(search)
      || normalize(party.abbreviation).includes(search));

    return of(paginate(filtered, page, pageSize));
  }

  public getParty(id: string): Observable<Party | undefined> {
    return of(this.parties.find(party => party.id === id));
  }

  public createParty(value: PartyFormValue): Observable<Party> {
    const created: Party = {
      id: crypto.randomUUID(),
      name: value.name,
      abbreviation: value.abbreviation,
      leaderName: value.leaderName,
      currentSeats: value.currentSeats,
      answeredStatementCount: 0,
      totalStatementCount: this.statements.length,
    };

    this.parties = [...this.parties, created];

    return of(created);
  }

  public updateParty(id: string, value: PartyFormValue): Observable<Party | undefined> {
    let updated: Party | undefined = undefined;

    this.parties = this.parties.map((party) => {
      if (party.id !== id) {
        return party;
      }

      updated = {
        ...party,
        name: value.name,
        abbreviation: value.abbreviation,
        leaderName: value.leaderName,
        currentSeats: value.currentSeats,
      };

      return updated;
    });

    return of(updated);
  }

  public deleteParty(id: string): Observable<void> {
    this.parties = this.parties.filter(party => party.id !== id);

    return of(undefined);
  }
}
