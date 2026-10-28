import { Injectable } from '@angular/core';

export type UserRole = 'superadmin' | 'party-admin';

export interface AuthSession {
  readonly token: string
  readonly userId: number
  readonly name: string
  readonly email: string
  readonly role: UserRole
  readonly partyId: number | null
  readonly partyName: string | null
}

const AUTH_STORAGE_KEY = 'stw-auth-session';

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'token' in value && 'userId' in value && 'name' in value && 'email' in value && 'role' in value
    && 'partyId' in value && 'partyName' in value
    && typeof value.token === 'string' && typeof value.userId === 'number'
    && typeof value.name === 'string' && typeof value.email === 'string'
    && (value.role === 'superadmin' || value.role === 'party-admin')
    && (value.partyId === null || typeof value.partyId === 'number')
    && (value.partyName === null || typeof value.partyName === 'string');
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private session: AuthSession | null = this.restoreSession();

  public isAuthenticated(): boolean {
    return this.session !== null;
  }

  public hasRole(role: UserRole): boolean {
    return this.session?.role === role;
  }

  public getSession(): AuthSession | null {
    return this.session;
  }

  public startSession(session: AuthSession, rememberMe: boolean): void {
    this.endSession();
    this.session = session;

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  public endSession(): void {
    this.session = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private restoreSession(): AuthSession | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (raw === null) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      return isAuthSession(parsed) ? parsed : null;
    }
    catch {
      return null;
    }
  }
}
