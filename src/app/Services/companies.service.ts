import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, Post } from '../models';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private readonly api = inject(ApiService);

  getCompanies(): Observable<Company[]> {
    return this.api.get<Company[]>('/companies');
  }

  getCompany(id: number): Observable<Company> {
    return this.api.get<Company>(`/companies/${id}`);
  }

  createCompany(body: Partial<Company>): Observable<Company> {
    return this.api.post<Company>('/companies', body);
  }

  updateCompany(id: number, body: Partial<Company>): Observable<Company> {
    return this.api.put<Company>(`/companies/${id}`, body);
  }

  follow(id: number): Observable<unknown> {
    return this.api.post(`/companies/${id}/follow`);
  }

  unfollow(id: number): Observable<void> {
    return this.api.delete(`/companies/${id}/follow`);
  }

  getFollowers(id: number): Observable<unknown[]> {
    return this.api.get(`/companies/${id}/followers`);
  }

  getEmployees(id: number): Observable<unknown[]> {
    return this.api.get(`/companies/${id}/employees`);
  }

  getAdmins(id: number): Observable<unknown[]> {
    return this.api.get(`/companies/${id}/admins`);
  }

  addAdmin(id: number, userId: number): Observable<unknown> {
    return this.api.post(`/companies/${id}/admins`, { userId });
  }

  removeAdmin(id: number, userId: number): Observable<void> {
    return this.api.delete(`/companies/${id}/admins/${userId}`);
  }

  getPosts(id: number): Observable<Post[]> {
    return this.api.get<Post[]>(`/companies/${id}/posts`);
  }

  getAnalytics(id: number): Observable<unknown> {
    return this.api.get(`/companies/${id}/analytics`);
  }

  getProducts(id: number): Observable<unknown[]> {
    return this.api.get(`/companies/${id}/products`);
  }

  getJobs(id: number): Observable<unknown[]> {
    return this.api.get(`/companies/${id}/jobs`);
  }
}
