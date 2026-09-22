import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../../../../../components/button/button.component';
import { EmptyStateComponent } from '../../../../../components/empty-state/empty-state.component';
import { SearchBarComponent } from '../../../../../components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../../../../components/status-badge/status-badge.component';
import type { Party } from '../../../../../types/party.interface';

const PERCENTAGE_MULTIPLIER = 100;

@Component({
  selector: 'stw-parties-table',
  imports: [ButtonComponent, EmptyStateComponent, SearchBarComponent, StatusBadgeComponent],
  templateUrl: './parties-table.component.html',
  styleUrl: './parties-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartiesTableComponent {
  public readonly parties = input.required<readonly Party[]>();

  public readonly total = input.required<number>();

  public readonly page = input.required<number>();

  public readonly pageSize = input.required<number>();

  public readonly search = input('');

  public readonly searchChange = output<string>();

  public readonly pageChange = output<number>();

  public readonly addRequested = output();

  public readonly editRequested = output<string>();

  public readonly deleteRequested = output<string>();

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  protected completionPercentage(party: Party): number {
    if (party.totalStatementCount === 0) {
      return 0;
    }

    return Math.round((party.answeredStatementCount / party.totalStatementCount) * PERCENTAGE_MULTIPLIER);
  }

  protected completionTone(party: Party): 'gray' | 'green' {
    return party.answeredStatementCount === party.totalStatementCount && party.totalStatementCount > 0 ? 'green' : 'gray';
  }

  protected goToPreviousPage(): void {
    if (this.page() > 1) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  protected goToNextPage(): void {
    if (this.page() < this.totalPages()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
