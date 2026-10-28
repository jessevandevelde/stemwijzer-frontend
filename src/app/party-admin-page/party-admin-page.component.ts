import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminHeaderComponent } from '../admin-page/components/admin-header/admin-header.component';
import { extractErrorMessage } from '../admin-page/extract-error-message';
import { EmptyStateComponent } from '../components/empty-state/empty-state.component';
import { SecurityNoticeComponent } from '../components/security-notice/security-notice.component';
import { AuthService } from '../services/auth.service';
import type { Answer } from '../types/answer.interface';
import type { PartyStatementAnswer } from './party-admin-page.interfaces';
import { PartyAdminPageService } from './party-admin-page.service';

const UNAUTHORIZED_STATUS = 401;

interface AnswerOption {
  readonly value: Answer
  readonly label: string
}

@Component({
  selector: 'stw-party-admin-page',
  imports: [AdminHeaderComponent, EmptyStateComponent, SecurityNoticeComponent],
  templateUrl: './party-admin-page.component.html',
  styleUrl: './party-admin-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyAdminPageComponent implements OnInit {
  protected readonly answerOptions: readonly AnswerOption[] = [
    { value: 'eens', label: 'Eens' },
    { value: 'neutraal', label: 'Neutraal' },
    { value: 'oneens', label: 'Oneens' },
  ];

  protected readonly statements = signal<readonly PartyStatementAnswer[]>([]);

  protected readonly loading = signal(true);

  protected readonly savingStatementId = signal<number | null>(null);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly answeredCount = computed(() => this.statements().filter(statement => statement.answer !== null).length);

  protected readonly userEmail: string;

  protected readonly userName: string;

  protected readonly partyName: string;

  private readonly authService = inject(AuthService);

  private readonly partyAdminPageService = inject(PartyAdminPageService);

  private readonly router = inject(Router);

  public constructor() {
    const session = this.authService.getSession();

    this.userEmail = session?.email ?? '';
    this.userName = session?.name ?? 'Partijbeheerder';
    this.partyName = session?.partyName ?? '';
  }

  public ngOnInit(): void {
    this.partyAdminPageService.listStatements().subscribe({
      next: (response) => {
        this.statements.set(response.statements);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.handleError(error);
      },
    });
  }

  protected handleAnswer(statement: PartyStatementAnswer, answer: Answer): void {
    if (statement.answer === answer || this.savingStatementId() !== null) {
      return;
    }

    this.savingStatementId.set(statement.statementId);
    this.errorMessage.set(null);

    this.partyAdminPageService.setAnswer(statement.statementId, answer).subscribe({
      next: (saved) => {
        this.statements.update(statements => statements.map(item => (item.statementId === saved.statementId ? saved : item)));
        this.savingStatementId.set(null);
      },
      error: (error: unknown) => {
        this.savingStatementId.set(null);
        this.handleError(error);
      },
    });
  }

  protected handleLogout(): void {
    this.authService.endSession();
    void this.router.navigateByUrl('/login');
  }

  // Een verlopen of ongeldig token stuurt de gebruiker terug naar de loginpagina.
  private handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === UNAUTHORIZED_STATUS) {
      this.handleLogout();

      return;
    }

    this.errorMessage.set(extractErrorMessage(error));
  }
}
