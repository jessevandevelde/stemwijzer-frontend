import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { PasswordToggleComponent } from '../../../components/password-toggle/password-toggle.component';
import { SecurityNoticeComponent } from '../../../components/security-notice/security-notice.component';
import type { PasswordChangeValue } from '../../party-admin-page.interfaces';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 255;

interface PasswordControls {
  readonly currentPassword: FormControl<string>
  readonly newPassword: FormControl<string>
  readonly repeatPassword: FormControl<string>
}

function required(control: AbstractControl): ValidationErrors | null {
  return Validators.required(control);
}

// Geeft een fout op het hele formulier als het herhaalde wachtwoord niet gelijk is aan het nieuwe.
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword: unknown = group.get('newPassword')?.value;
  const repeatPassword: unknown = group.get('repeatPassword')?.value;

  return newPassword === repeatPassword ? null : { passwordMismatch: true };
}

// Wachtwoord wijzigen op /partij; of het huidige wachtwoord klopt, controleert de backend.
@Component({
  selector: 'stw-party-password-form',
  imports: [ReactiveFormsModule, ButtonComponent, PasswordToggleComponent, SecurityNoticeComponent],
  templateUrl: './party-password-form.component.html',
  styleUrl: './party-password-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyPasswordFormComponent {
  public readonly saving = input(false);

  public readonly errorMessage = input<string | null>(null);

  public readonly submitPassword = output<PasswordChangeValue>();

  protected readonly passwordVisible = signal(false);

  protected readonly form = new FormGroup<PasswordControls>({
    currentPassword: new FormControl('', { nonNullable: true, validators: [required] }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [required, Validators.minLength(MIN_PASSWORD_LENGTH), Validators.maxLength(MAX_PASSWORD_LENGTH)],
    }),
    repeatPassword: new FormControl('', { nonNullable: true, validators: [required] }),
  }, { validators: [passwordsMatch] });

  protected isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  protected isMismatchVisible(): boolean {
    const { repeatPassword } = this.form.controls;

    return this.form.hasError('passwordMismatch') && repeatPassword.valid && (repeatPassword.dirty || repeatPassword.touched);
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();

      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.submitPassword.emit({ currentPassword, newPassword });
  }
}
