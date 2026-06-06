import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly api = inject(ApiService);

  getNotifications(): Observable<Notification[]> {
    return this.api.get<Notification[]>('/notifications');
  }

  markRead(id: number): Observable<unknown> {
    return this.api.post(`/notifications/${id}/read`);
  }

  markAllRead(): Observable<unknown> {
    return this.api.post('/notifications/read-all');
  }

  deleteNotification(id: number): Observable<void> {
    return this.api.delete(`/notifications/${id}`);
  }

  getPreferences(): Observable<unknown> {
    return this.api.get('/notifications/preferences');
  }

  updatePreferences(body: unknown): Observable<unknown> {
    return this.api.put('/notifications/preferences', body);
  }

  registerPushToken(token: string, platform?: string): Observable<unknown> {
    return this.api.post('/notifications/push-token', { token, platform });
  }
}
