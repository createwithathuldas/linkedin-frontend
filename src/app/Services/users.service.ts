import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Education, Experience, Skill, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  getUser(userId: number): Observable<any> {
    return this.api.get<any>(`/users/${userId}`);
  }

  updateUser(userId: number, body: Partial<User>): Observable<User> {
    return this.api.put<User>(`/users/${userId}`, body);
  }

  uploadAvatar(userId: number, file: File): Observable<unknown> {
    return this.api.upload(`/users/${userId}/avatar`, file);
  }

  uploadBanner(userId: number, file: File): Observable<unknown> {
    return this.api.upload(`/users/${userId}/banner`, file);
  }

  setOpenToWork(userId: number, openToWork: boolean, config?: unknown): Observable<unknown> {
    return this.api.put(`/users/${userId}/open-to-work`, { openToWork, config });
  }

  updatePrivacy(userId: number, body: unknown): Observable<unknown> {
    return this.api.put(`/users/${userId}/privacy`, body);
  }

  getProfileViews(userId: number): Observable<unknown[]> {
    return this.api.get(`/users/${userId}/profile-views`);
  }

  getExperience(userId: number): Observable<Experience[]> {
    return this.api.get<Experience[]>(`/users/${userId}/experience`);
  }

  addExperience(userId: number, body: Partial<Experience>): Observable<Experience> {
    return this.api.post<Experience>(`/users/${userId}/experience`, body);
  }

  updateExperience(userId: number, id: number, body: Partial<Experience>): Observable<Experience> {
    return this.api.put<Experience>(`/users/${userId}/experience/${id}`, body);
  }

  deleteExperience(userId: number, id: number): Observable<void> {
    return this.api.delete(`/users/${userId}/experience/${id}`);
  }

  getEducation(userId: number): Observable<Education[]> {
    return this.api.get<Education[]>(`/users/${userId}/education`);
  }

  addEducation(userId: number, body: Partial<Education>): Observable<Education> {
    return this.api.post<Education>(`/users/${userId}/education`, body);
  }

  updateEducation(userId: number, id: number, body: Partial<Education>): Observable<Education> {
    return this.api.put<Education>(`/users/${userId}/education/${id}`, body);
  }

  deleteEducation(userId: number, id: number): Observable<void> {
    return this.api.delete(`/users/${userId}/education/${id}`);
  }

  getSkills(userId: number): Observable<Skill[]> {
    return this.api.get<Skill[]>(`/users/${userId}/skills`);
  }

  addSkill(userId: number, name: string): Observable<Skill> {
    return this.api.post<Skill>(`/users/${userId}/skills`, { name });
  }

  deleteSkill(userId: number, id: number): Observable<void> {
    return this.api.delete(`/users/${userId}/skills/${id}`);
  }

  endorseSkill(userId: number, skillId: number): Observable<unknown> {
    return this.api.post(`/users/${userId}/skills/${skillId}/endorse`);
  }

  blockUser(userId: number): Observable<unknown> {
    return this.api.post(`/users/${userId}/block`);
  }

  unblockUser(userId: number): Observable<void> {
    return this.api.delete(`/users/${userId}/block`);
  }

  getConnectionDegree(userId: number): Observable<{ degree: number }> {
    return this.api.get(`/users/${userId}/degree`);
  }
}
