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

const PERCENT_MAX = 100;
const SPECTRUM_MIN = 12;
const SPECTRUM_MAX = 88;
const SPECTRUM_RANGE = SPECTRUM_MAX - SPECTRUM_MIN;
const SPECTRUM_Y_BASE = 18;
const SPECTRUM_Y_RANGE = 64;
const SPECTRUM_SEED_MULTIPLIER = 29;
const SPECTRUM_INDEX_MULTIPLIER = 17;
const USER_RANGE = 34;
const NEUTRAL_BASELINE = 0.33;
const SPECTRUM_CENTER = 50;
const MIN_ABBREVIATION_WORD_LENGTH = 2;
const MAX_ABBREVIATION_WORDS = 3;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
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

  protected readonly spectrumPoints = computed<readonly SpectrumPoint[]>(() => this.matchingResult().matches.map((match, index) => ({
    id: match.partyId,
    label: this.abbreviation(match.partyName),
    name: match.partyName,
    x: SPECTRUM_MIN + this.percentage(match) / PERCENT_MAX * SPECTRUM_RANGE,
    y: SPECTRUM_Y_BASE + (match.partyId * SPECTRUM_SEED_MULTIPLIER + index * SPECTRUM_INDEX_MULTIPLIER) % SPECTRUM_Y_RANGE,
  })));

  protected readonly userPoint = computed(() => {
    const summary = this.answerSummary();
    const answered = Math.max(summary.total - summary.skipped, 1);
    const opinionBalance = (summary.agree - summary.disagree) / answered;
    const neutralShare = summary.neutral / answered;

    return {
      x: clamp(SPECTRUM_CENTER + opinionBalance * USER_RANGE, SPECTRUM_MIN, SPECTRUM_MAX),
      y: clamp(SPECTRUM_CENTER - (neutralShare - NEUTRAL_BASELINE) * USER_RANGE, SPECTRUM_MIN, SPECTRUM_MAX),
    };
  });

  protected readonly selectedParty = signal<Party | null>(null);

  protected readonly partyLoading = signal(false);

  protected readonly partyError = signal<string | null>(null);

  protected readonly partyDetailHint = computed(() => {
    if (this.partyLoading()) {
      return 'Partij-informatie laden...';
    }

    return this.partyError() ?? 'Tik op de kaart voor meer over deze partij ›';
  });

  private readonly service = inject(StemwijzerPageService);

  protected openPartyDetail(partyId: number): void {
    this.partyLoading.set(true);
    this.partyError.set(null);

    this.service.getParty(partyId).subscribe({
      next: (party) => {
        this.partyLoading.set(false);
        this.selectedParty.set(party);
      },
      error: () => {
        this.partyLoading.set(false);
        this.partyError.set('De partij-informatie kon niet worden geladen. Probeer het opnieuw.');
      },
    });
  }

  protected closePartyDetail(): void {
    this.selectedParty.set(null);
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
