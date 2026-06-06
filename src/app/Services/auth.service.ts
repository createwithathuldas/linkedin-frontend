import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  VerifyOtpRequest
} from '../models';

const TOKEN_KEY = 'li_access_token';
const REFRESH_KEY = 'li_refresh_token';
const USER_KEY = 'li_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<User | null>(this.loadUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.getAccessToken() && !!this.currentUserSignal());

  register(request: RegisterRequest): Observable<{ message: string; email: string }> {
    return this.api.post('/auth/register', request);
  }

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.api.post<TokenResponse>('/auth/login', request).pipe(
      tap(response => this.setSession(response))
    );
  }

  verifyOtp(request: VerifyOtpRequest): Observable<TokenResponse> {
    return this.api.post<TokenResponse>('/auth/verify-otp', request).pipe(
      tap(response => this.setSession(response))
    );
  }

  resendOtp(email: string): Observable<{ message: string }> {
    return this.api.post('/auth/resend-otp', { email });
  }

  refresh(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    return this.api.post<TokenResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('/auth/logout').pipe(
      tap(() => this.clearSession())
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.api.post('/auth/forgot-password', { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<{ message: string }> {
    return this.api.post('/auth/reset-password', { email, token, newPassword });
  }

  enableMfa(): Observable<unknown> {
    return this.api.post('/auth/mfa/enable');
  }

  verifyMfa(code: string): Observable<unknown> {
    return this.api.post('/auth/mfa/verify', { code });
  }

  getSessions(): Observable<unknown> {
    return this.api.get('/auth/sessions');
  }

  oauthLogin(provider: string, body: unknown): Observable<TokenResponse> {
    return this.api.post<TokenResponse>(`/auth/oauth/${provider}`, body).pipe(
      tap(response => this.setSession(response))
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logoutLocal(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private setSession(response: TokenResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
