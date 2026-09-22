import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../../../../../components/button/button.component';
import type { DropdownOption } from '../../../../../components/dropdown/dropdown.component';
import { DropdownComponent } from '../../../../../components/dropdown/dropdown.component';
import { EmptyStateComponent } from '../../../../../components/empty-state/empty-state.component';
import { SearchBarComponent } from '../../../../../components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../../../../components/status-badge/status-badge.component';
import type { Statement } from '../../../../../types/statement.interface';

@Component({
  selector: 'stw-statements-table',
  imports: [ButtonComponent, DropdownComponent, EmptyStateComponent, SearchBarComponent, StatusBadgeComponent],
  templateUrl: './statements-table.component.html',
  styleUrl: './statements-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementsTableComponent {
  public readonly statements = input.required<readonly Statement[]>();

  public readonly total = input.required<number>();

  public readonly page = input.required<number>();

  public readonly pageSize = input.required<number>();

  public readonly search = input('');

  public readonly category = input.required<string>();

  public readonly categoryOptions = input.required<readonly DropdownOption[]>();

  public readonly searchChange = output<string>();

  public readonly categoryChange = output<string>();

  public readonly pageChange = output<number>();

  public readonly addRequested = output();

  public readonly editRequested = output<string>();

  public readonly deleteRequested = output<string>();

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

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
