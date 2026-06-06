import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly api = inject(ApiService);

  getProfileAnalytics(): Observable<unknown> {
    return this.api.get('/analytics/profile');
  }

  getPostsAnalytics(): Observable<unknown> {
    return this.api.get('/analytics/posts');
  }

  getFollowersAnalytics(): Observable<unknown> {
    return this.api.get('/analytics/followers');
  }

  getCompanyAnalytics(id: number): Observable<unknown> {
    return this.api.get(`/analytics/company/${id}`);
  }
}
