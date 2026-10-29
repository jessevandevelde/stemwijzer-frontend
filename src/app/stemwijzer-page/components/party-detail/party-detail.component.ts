import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { PartyMatch } from '../../../types/matching.interface';
import type { Party } from '../../../types/party.interface';

const MAX_INITIALS = 2;

@Component({
  selector: 'stw-party-detail',
  imports: [NgOptimizedImage],
  templateUrl: './party-detail.component.html',
  styleUrl: './party-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyDetailComponent {
  public readonly party = input.required<Party>();

  public readonly match = input.required<PartyMatch>();

  public readonly closed = output();

  protected readonly logoFailed = signal(false);

  protected readonly initials = computed(() => this.party().name
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, MAX_INITIALS)
    .map(word => word.charAt(0).toUpperCase())
    .join(''));

  protected readonly percentage = computed(() => Math.round(this.match().matchPercentage ?? 0));

  protected onLogoError(): void {
    this.logoFailed.set(true);
  }
}
