import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PremiumService {
  private readonly api = inject(ApiService);

  getPlans(): Observable<unknown[]> {
    return this.api.get('/premium/plans');
  }

  subscribe(tier: string): Observable<unknown> {
    return this.api.post('/premium/subscribe', { tier });
  }

  upgrade(tier: string): Observable<unknown> {
    return this.api.post('/premium/upgrade', { tier });
  }

  cancel(): Observable<unknown> {
    return this.api.post('/premium/cancel');
  }

  getStatus(): Observable<unknown> {
    return this.api.get('/premium/status');
  }

  getInMailCredits(): Observable<{ credits: number }> {
    return this.api.get('/premium/inmail-credits');
  }

  getFeatures(): Observable<unknown[]> {
    return this.api.get('/premium/features');
  }
}
