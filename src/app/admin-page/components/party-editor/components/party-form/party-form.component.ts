import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartyBadgeComponent } from '../../../../../components/party-badge/party-badge.component';
import type { PartyFormValue } from '../../../../admin-page.interfaces';

const MAX_NAME_LENGTH = 100;
const MAX_ABBREVIATION_LENGTH = 20;
const MAX_LEADER_LENGTH = 100;
const MAX_SEATS = 150;
const COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/u;
const WHOLE_NUMBER_PATTERN = /^\d+$/u;
const FALLBACK_COLOR = '#16224F';

interface PartyFormControls {
  readonly name: FormControl<string>
  readonly abbreviation: FormControl<string>
  readonly color: FormControl<string>
  readonly seats: FormControl<number | null>
  readonly leader: FormControl<string>
  readonly description: FormControl<string>
  readonly imageUrl: FormControl<string>
  readonly isActive: FormControl<boolean>
}

function toNullIfEmpty(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}

function required(control: AbstractControl): ValidationErrors | null {
  return Validators.required(control);
}

@Component({
  selector: 'stw-party-form',
  imports: [PartyBadgeComponent, ReactiveFormsModule],
  templateUrl: './party-form.component.html',
  styleUrl: './party-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyFormComponent {
  public readonly initialValue = input<PartyFormValue | null>(null);

  public readonly loading = input(false);

  // Partijbeheerders mogen hun partij niet zelf (de)activeren.
  public readonly showActiveToggle = input(true);

  public readonly submitForm = output<PartyFormValue>();

  protected readonly maxSeats = MAX_SEATS;

  protected readonly showLogoInput = signal(false);

  protected readonly form = new FormGroup<PartyFormControls>({
    name: new FormControl('', { nonNullable: true, validators: [required, Validators.maxLength(MAX_NAME_LENGTH)] }),
    abbreviation: new FormControl('', { nonNullable: true, validators: [required, Validators.maxLength(MAX_ABBREVIATION_LENGTH)] }),
    color: new FormControl('', { nonNullable: true, validators: [Validators.pattern(COLOR_PATTERN)] }),
    seats: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(MAX_SEATS), Validators.pattern(WHOLE_NUMBER_PATTERN)],
    }),
    leader: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(MAX_LEADER_LENGTH)] }),
    description: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  public constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value !== null) {
        this.form.setValue({
          name: value.name,
          abbreviation: value.abbreviation ?? '',
          color: value.color ?? '',
          seats: value.seats,
          leader: value.leader ?? '',
          description: value.description ?? '',
          imageUrl: value.imageUrl ?? '',
          isActive: value.isActive,
        });
      }
    });
  }

  protected isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  protected badgeColor(): string {
    const { color } = this.form.controls;

    return color.valid && color.value !== '' ? color.value : FALLBACK_COLOR;
  }

  protected handleColorPick(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.form.controls.color.setValue(event.target.value.toUpperCase());
      this.form.controls.color.markAsDirty();
    }
  }

  protected toggleLogoInput(): void {
    this.showLogoInput.update(isShown => !isShown);
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();

      return;
    }

    const raw = this.form.getRawValue();

    this.submitForm.emit({
      name: raw.name.trim(),
      abbreviation: toNullIfEmpty(raw.abbreviation),
      color: toNullIfEmpty(raw.color)?.toUpperCase() ?? null,
      seats: raw.seats,
      leader: toNullIfEmpty(raw.leader),
      description: toNullIfEmpty(raw.description),
      imageUrl: toNullIfEmpty(raw.imageUrl),
      isActive: raw.isActive,
    });
  }
}
