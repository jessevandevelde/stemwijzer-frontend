import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityNoticeComponent } from '../../../components/security-notice/security-notice.component';
import type { StatementFormValue } from '../../admin-page.interfaces';
import { AdminPageService } from '../../admin-page.service';
import { StatementFormComponent } from './components/statement-form/statement-form.component';

@Component({
  selector: 'stw-statement-editor',
  imports: [SecurityNoticeComponent, StatementFormComponent],
  templateUrl: './statement-editor.component.html',
  styleUrl: './statement-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementEditorComponent implements OnInit {
  protected readonly categories = inject(AdminPageService).getCategories();

  protected readonly initialValue = signal<StatementFormValue | null>(null);

  protected readonly saving = signal(false);

  protected readonly notFound = signal(false);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly statementId: string | null;

  private readonly adminPageService = inject(AdminPageService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  public constructor() {
    this.statementId = this.route.snapshot.paramMap.get('id');
  }

  public ngOnInit(): void {
    if (this.statementId === null) {
      return;
    }

    this.adminPageService.getStatement(this.statementId).subscribe((statement) => {
      if (statement === undefined) {
        this.notFound.set(true);

        return;
      }

      this.initialValue.set({ text: statement.text, category: statement.category });
    });
  }

  protected handleSubmit(value: StatementFormValue): void {
    this.saving.set(true);
    this.errorMessage.set(null);

    const save$ = this.statementId === null
      ? this.adminPageService.createStatement(value)
      : this.adminPageService.updateStatement(this.statementId, value);

    save$.subscribe(() => {
      this.saving.set(false);
      void this.router.navigate(['/admin'], { fragment: 'stellingen-panel' });
    });
  }

  protected handleCancel(): void {
    void this.router.navigate(['/admin'], { fragment: 'stellingen-panel' });
  }
}
