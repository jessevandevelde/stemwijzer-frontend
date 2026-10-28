import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import type { AnswerSummary, MatchingResult, PartyMatch } from '../../../types/matching.interface';
import type { Party } from '../../../types/party.interface';
import { StemwijzerPageService } from '../../stemwijzer-page.service';
import { PartyDetailComponent } from '../party-detail/party-detail.component';

interface SpectrumPoint {
  readonly id: number
  readonly label: string
  readonly name: string
  readonly x: number
  readonly y: number
}

interface PartyDetail {
  readonly party: Party
  readonly match: PartyMatch
}

const SPECTRUM_MIN = 12;
const SPECTRUM_MAX = 88;
const HALF = 2;
const SPECTRUM_CENTER = (SPECTRUM_MIN + SPECTRUM_MAX) / HALF;
const SPECTRUM_HALF_RANGE = (SPECTRUM_MAX - SPECTRUM_MIN) / HALF;
const MIN_ABBREVIATION_WORD_LENGTH = 2;
const MAX_ABBREVIATION_WORDS = 3;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function toSpectrumCoordinate(position: number): number {
  return clamp(SPECTRUM_CENTER + position * SPECTRUM_HALF_RANGE, SPECTRUM_MIN, SPECTRUM_MAX);
}

@Component({
  selector: 'stw-results',
  imports: [PartyDetailComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  public readonly matchingResult = input.required<MatchingResult>();

  public readonly answerSummary = input.required<AnswerSummary>();

  public readonly restart = output();

  protected readonly bestMatch = computed(() => this.matchingResult().matches[0] ?? null);

  protected readonly otherMatches = computed(() => this.matchingResult().matches.slice(1));

  protected readonly spectrumPoints = computed<readonly SpectrumPoint[]>(() => this.matchingResult().matches.map(match => ({
    id: match.partyId,
    label: this.abbreviation(match.partyName),
    name: match.partyName,
    x: toSpectrumCoordinate(match.economicPosition),
    y: toSpectrumCoordinate(match.culturalPosition),
  })));

  protected readonly userPoint = computed(() => {
    const position = this.matchingResult().userPosition;

    return {
      x: toSpectrumCoordinate(position.economicPosition),
      y: toSpectrumCoordinate(position.culturalPosition),
    };
  });

  protected readonly partyDetail = signal<PartyDetail | null>(null);

  protected readonly partyLoading = signal(false);

  protected readonly partyError = signal<string | null>(null);

  protected readonly partyDetailHint = computed(() => {
    if (this.partyLoading()) {
      return 'Partij-informatie laden...';
    }

    return this.partyError() ?? 'Tik op de kaart voor meer over deze partij ›';
  });

  private readonly service = inject(StemwijzerPageService);

  protected openPartyDetail(match: PartyMatch): void {
    this.partyLoading.set(true);
    this.partyError.set(null);

    this.service.getParty(match.partyId).subscribe({
      next: (party) => {
        this.partyLoading.set(false);
        this.partyDetail.set({ party, match });
      },
      error: () => {
        this.partyLoading.set(false);
        this.partyError.set('De partij-informatie kon niet worden geladen. Probeer het opnieuw.');
      },
    });
  }

  protected closePartyDetail(): void {
    this.partyDetail.set(null);
  }

  protected percentage(match: PartyMatch): number {
    return Math.round(match.matchPercentage ?? 0);
  }

  protected restartQuestionnaire(): void {
    this.restart.emit();
  }

  private abbreviation(name: string): string {
    return name
      .split(' ')
      .filter(word => word.length > MIN_ABBREVIATION_WORD_LENGTH)
      .slice(0, MAX_ABBREVIATION_WORDS)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
