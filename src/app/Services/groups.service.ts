import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Group, Post } from '../models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly api = inject(ApiService);

  getGroups(): Observable<Group[]> {
    return this.api.get<Group[]>('/groups');
  }

  getGroup(id: number): Observable<Group> {
    return this.api.get<Group>(`/groups/${id}`);
  }

  createGroup(body: Partial<Group>): Observable<Group> {
    return this.api.post<Group>('/groups', body);
  }

  updateGroup(id: number, body: Partial<Group>): Observable<Group> {
    return this.api.put<Group>(`/groups/${id}`, body);
  }

  join(id: number): Observable<unknown> {
    return this.api.post(`/groups/${id}/join`);
  }

  leave(id: number): Observable<void> {
    return this.api.delete(`/groups/${id}/leave`);
  }

  getMembers(id: number): Observable<unknown[]> {
    return this.api.get(`/groups/${id}/members`);
  }

  updateMemberRole(id: number, userId: number, role: string): Observable<unknown> {
    return this.api.put(`/groups/${id}/members/${userId}/role`, { role });
  }

  removeMember(id: number, userId: number): Observable<void> {
    return this.api.delete(`/groups/${id}/members/${userId}`);
  }

  getPosts(id: number): Observable<Post[]> {
    return this.api.get<Post[]>(`/groups/${id}/posts`);
  }

  getMyGroups(): Observable<Group[]> {
    return this.api.get<Group[]>('/groups/my');
  }

  getSuggested(): Observable<Group[]> {
    return this.api.get<Group[]>('/groups/suggested');
  }

  invite(id: number, userId: number, message?: string): Observable<unknown> {
    return this.api.post(`/groups/${id}/invite`, { userId, message });
  }
}
