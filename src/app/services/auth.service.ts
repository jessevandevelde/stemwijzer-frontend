import { Injectable } from '@angular/core';

export interface AuthSession {
  readonly token: string
  readonly userId: number
  readonly name: string
  readonly email: string
}

const AUTH_STORAGE_KEY = 'stw-auth-session';

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'token' in value && 'userId' in value && 'name' in value && 'email' in value
    && typeof value.token === 'string' && typeof value.userId === 'number'
    && typeof value.name === 'string' && typeof value.email === 'string';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private session: AuthSession | null = this.restoreSession();

  public isAuthenticated(): boolean {
    return this.session !== null;
  }

  public getSession(): AuthSession | null {
    return this.session;
  }

  public startSession(session: AuthSession, rememberMe: boolean): void {
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
