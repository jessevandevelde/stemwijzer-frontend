import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../components/button/button.component';
import type { PartyFormValue } from '../../../../admin-page.interfaces';

const MIN_SEATS = 0;
const MAX_SEATS = 150;

interface PartyFormControls {
  readonly name: FormControl<string>
  readonly abbreviation: FormControl<string>
  readonly leaderName: FormControl<string>
  readonly currentSeats: FormControl<number>
}

@Component({
  selector: 'stw-party-form',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './party-form.component.html',
  styleUrl: './party-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyFormComponent {
  public readonly initialValue = input<PartyFormValue | null>(null);

  public readonly loading = input(false);

  public readonly submitForm = output<PartyFormValue>();

  public readonly cancelled = output();

  protected readonly form = new FormGroup<PartyFormControls>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [(control: AbstractControl): ValidationErrors | null => Validators.required(control)],
    }),
    abbreviation: new FormControl('', {
      nonNullable: true,
      validators: [(control: AbstractControl): ValidationErrors | null => Validators.required(control)],
    }),
    leaderName: new FormControl('', {
      nonNullable: true,
      validators: [(control: AbstractControl): ValidationErrors | null => Validators.required(control)],
    }),
    currentSeats: new FormControl(0, {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        Validators.min(MIN_SEATS),
        Validators.max(MAX_SEATS),
      ],
    }),
  });

  public constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value !== null) {
        this.form.setValue(value);
      }
    });
  }

  protected isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();

      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }
}
