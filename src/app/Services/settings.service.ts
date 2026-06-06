import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly api = inject(ApiService);

  getSettings(): Observable<unknown> {
    return this.api.get('/settings');
  }

  updatePrivacy(body: unknown): Observable<unknown> {
    return this.api.put('/settings/privacy', body);
  }

  updateNotifications(body: unknown): Observable<unknown> {
    return this.api.put('/settings/notifications', body);
  }

  updateJobSeeking(body: unknown): Observable<unknown> {
    return this.api.put('/settings/job-seeking', body);
  }

  updateAdvertising(body: unknown): Observable<unknown> {
    return this.api.put('/settings/advertising', body);
  }

  updateDataPrivacy(body: unknown): Observable<unknown> {
    return this.api.put('/settings/data-privacy', body);
  }

  updateAccount(body: unknown): Observable<unknown> {
    return this.api.put('/settings/account', body);
  }

  requestDataDownload(): Observable<unknown> {
    return this.api.post('/settings/data-download');
  }

  deleteAccount(): Observable<unknown> {
    return this.api.delete('/settings/account/permanent');
  }
}
