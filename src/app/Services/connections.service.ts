import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Connection, ConnectionRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  private readonly api = inject(ApiService);

  sendRequest(userId: number, message?: string): Observable<ConnectionRequest> {
    return this.api.post<ConnectionRequest>('/connections/request', { userId, message });
  }

  acceptRequest(id: number): Observable<Connection> {
    return this.api.post<Connection>(`/connections/request/${id}/accept`);
  }

  withdrawRequest(id: number): Observable<void> {
    return this.api.delete(`/connections/request/${id}`);
  }

  removeConnection(userId: number): Observable<void> {
    return this.api.delete(`/connections/${userId}`);
  }

  getConnections(): Observable<Connection[]> {
    return this.api.get<Connection[]>('/connections');
  }

  getReceivedRequests(): Observable<ConnectionRequest[]> {
    return this.api.get<ConnectionRequest[]>('/connections/received');
  }

  getSentRequests(): Observable<ConnectionRequest[]> {
    return this.api.get<ConnectionRequest[]>('/connections/sent');
  }

  getSuggestions(): Observable<User[]> {
    return this.api.get<User[]>('/connections/suggestions');
  }

  getSuggestionsByCategory(category: string): Observable<User[]> {
    return this.api.get<User[]>(`/connections/suggestions/${category}`);
  }

  dismissSuggestion(userId: number): Observable<void> {
    return this.api.post(`/connections/suggestions/${userId}/dismiss`);
  }

  getSettings(): Observable<unknown> {
    return this.api.get('/connections/settings');
  }

  updateSettings(body: unknown): Observable<unknown> {
    return this.api.put('/connections/settings', body);
  }

  follow(userId: number): Observable<unknown> {
    return this.api.post(`/follow/${userId}`);
  }

  unfollow(userId: number): Observable<void> {
    return this.api.delete(`/follow/${userId}`);
  }

  getFollowers(): Observable<User[]> {
    return this.api.get<User[]>('/follow/followers');
  }

  getFollowing(): Observable<User[]> {
    return this.api.get<User[]>('/follow/following');
  }
}
