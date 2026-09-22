import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UserAvatarComponent } from '../../../components/user-avatar/user-avatar.component';

@Component({
  selector: 'stw-admin-header',
  imports: [UserAvatarComponent],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  public readonly userEmail = input.required<string>();

  public readonly userName = input.required<string>();

  public readonly logoutRequested = output();
}
