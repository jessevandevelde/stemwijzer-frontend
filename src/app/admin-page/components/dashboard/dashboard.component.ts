import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { DropdownOption } from '../../../components/dropdown/dropdown.component';
import type { DashboardMetrics, PaginatedResult } from '../../../types/admin.interface';
import type { Party } from '../../../types/party.interface';
import type { Statement } from '../../../types/statement.interface';
import { ALL_CATEGORIES_OPTION } from '../../admin-page.interfaces';
import type { PartyListFilters, StatementListFilters } from '../../admin-page.interfaces';
import { AdminPageService } from '../../admin-page.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { PartiesTableComponent } from './components/parties-table/parties-table.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { StatementsTableComponent } from './components/statements-table/statements-table.component';

const PAGE_SIZE = 5;

const STATEMENT_NUMBER_PADDING = 2;

interface PendingDeletion {
  readonly type: 'statement' | 'party'
  readonly id: string
  readonly label: string
}

function emptyResult<T>(pageSize: number): PaginatedResult<T> {
  return { items: [], total: 0, page: 1, pageSize };
}

@Component({
  selector: 'stw-dashboard',
  imports: [ConfirmationDialogComponent, PartiesTableComponent, QuickActionsComponent, StatementsTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly metrics = signal<DashboardMetrics>({ activeStatementCount: 0, registeredPartyCount: 0 });

  protected readonly statementsResult = signal<PaginatedResult<Statement>>(emptyResult(PAGE_SIZE));

  protected readonly partiesResult = signal<PaginatedResult<Party>>(emptyResult(PAGE_SIZE));

  protected readonly statementFilters = signal<StatementListFilters>({ search: '', category: ALL_CATEGORIES_OPTION });

  protected readonly statementPage = signal(1);

  protected readonly partyFilters = signal<PartyListFilters>({ search: '' });

  protected readonly partyPage = signal(1);

  protected readonly pendingDeletion = signal<PendingDeletion | null>(null);

  protected readonly categoryOptions: readonly DropdownOption[];

  private readonly adminPageService = inject(AdminPageService);

  private readonly router = inject(Router);

  public constructor() {
    this.categoryOptions = [
      { value: ALL_CATEGORIES_OPTION, label: ALL_CATEGORIES_OPTION },
      ...this.adminPageService.getCategories().map(category => ({ value: category, label: category })),
    ];
  }

  public ngOnInit(): void {
    this.loadMetrics();
    this.loadStatements();
    this.loadParties();
  }

  protected handleStatementSearchChange(search: string): void {
    this.statementFilters.update(filters => ({ ...filters, search }));
    this.statementPage.set(1);
    this.loadStatements();
  }

  protected handleStatementCategoryChange(category: string): void {
    this.statementFilters.update(filters => ({ ...filters, category }));
    this.statementPage.set(1);
    this.loadStatements();
  }

  protected handleStatementPageChange(page: number): void {
    this.statementPage.set(page);
    this.loadStatements();
  }

  protected handlePartySearchChange(search: string): void {
    this.partyFilters.set({ search });
    this.partyPage.set(1);
    this.loadParties();
  }

  protected handlePartyPageChange(page: number): void {
    this.partyPage.set(page);
    this.loadParties();
  }

  protected navigateToNewStatement(): void {
    void this.router.navigate(['/admin/stellingen/nieuw']);
  }

  protected navigateToEditStatement(id: string): void {
    void this.router.navigate(['/admin/stellingen', id]);
  }

  protected navigateToNewParty(): void {
    void this.router.navigate(['/admin/partijen/nieuw']);
  }

  protected navigateToEditParty(id: string): void {
    void this.router.navigate(['/admin/partijen', id]);
  }

  protected requestStatementDeletion(id: string): void {
    const statement = this.statementsResult().items.find(item => item.id === id);

    if (statement === undefined) {
      return;
    }

    this.pendingDeletion.set({
      type: 'statement',
      id,
      label: `stelling #${statement.number.toString().padStart(STATEMENT_NUMBER_PADDING, '0')} (${statement.category})`,
    });
  }

  protected requestPartyDeletion(id: string): void {
    const party = this.partiesResult().items.find(item => item.id === id);

    if (party === undefined) {
      return;
    }

    this.pendingDeletion.set({ type: 'party', id, label: `partij ${party.name}` });
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
  }

  protected confirmDeletion(): void {
    const pending = this.pendingDeletion();

    if (pending === null) {
      return;
    }

    const deletion$ = pending.type === 'statement'
      ? this.adminPageService.deleteStatement(pending.id)
      : this.adminPageService.deleteParty(pending.id);

    deletion$.subscribe(() => {
      this.pendingDeletion.set(null);
      this.loadMetrics();

      if (pending.type === 'statement') {
        this.loadStatements();
      }
      else {
        this.loadParties();
      }
    });
  }

  private loadMetrics(): void {
    this.adminPageService.getDashboardMetrics().subscribe((metrics) => {
      this.metrics.set(metrics);
    });
  }

  private loadStatements(): void {
    this.adminPageService.getStatements(this.statementFilters(), this.statementPage(), PAGE_SIZE).subscribe((result) => {
      this.statementsResult.set(result);
    });
  }

  private loadParties(): void {
    this.adminPageService.getParties(this.partyFilters(), this.partyPage(), PAGE_SIZE).subscribe((result) => {
      this.partiesResult.set(result);
    });
  }
}
