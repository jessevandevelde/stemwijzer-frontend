import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SecurityNoticeComponent } from '../../../components/security-notice/security-notice.component';
import type { PartyFormValue } from '../../admin-page.interfaces';
import { AdminPageService } from '../../admin-page.service';
import { extractErrorMessage } from '../../extract-error-message';
import { PartyFormComponent } from './components/party-form/party-form.component';

@Component({
  selector: 'stw-party-editor',
  imports: [PartyFormComponent, RouterLink, SecurityNoticeComponent],
  templateUrl: './party-editor.component.html',
  styleUrl: './party-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyEditorComponent implements OnInit {
  protected readonly initialValue = signal<PartyFormValue | null>(null);

  protected readonly saving = signal(false);

  protected readonly notFound = signal(false);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly partyId: number | null;

  protected readonly pageLabel = computed(() => {
    const party = this.initialValue();

    if (this.partyId === null) {
      return 'Nieuwe partij';
    }

    return party === null ? 'Partij bewerken' : `${party.name} bewerken`;
  });

  private readonly adminPageService = inject(AdminPageService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  public constructor() {
    const rawId = this.route.snapshot.paramMap.get('id');

    this.partyId = rawId === null ? null : Number(rawId);
  }

  public ngOnInit(): void {
    if (this.partyId === null) {
      return;
    }

    this.adminPageService.getParty(this.partyId).subscribe((party) => {
      if (party === undefined) {
        this.notFound.set(true);

        return;
      }

      this.initialValue.set({
        name: party.name,
        description: party.description,
        imageUrl: party.imageUrl,
        isActive: party.isActive,
      });
    });
  }

  protected handleSubmit(value: PartyFormValue): void {
    this.saving.set(true);
    this.errorMessage.set(null);

    const save$ = this.partyId === null
      ? this.adminPageService.createParty(value)
      : this.adminPageService.updateParty(this.partyId, value);

    save$.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/admin'], { fragment: 'partijen-panel' });
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      },
    });
  }

  protected handleCancel(): void {
    void this.router.navigate(['/admin'], { fragment: 'partijen-panel' });
  }
}
