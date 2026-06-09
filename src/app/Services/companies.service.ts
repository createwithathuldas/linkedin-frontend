import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Company, CompanyAdmin, CompanyProduct, Job, Post, SearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private readonly api = inject(ApiService);

  getCompanies(): Observable<Company[]> {
    return this.searchCompanies('');
  }

  searchCompanies(q: string): Observable<Company[]> {
    return this.api.get<SearchResult[]>('/search/companies', { q }).pipe(
      map(results => (Array.isArray(results) ? results : []).map(result => ({
        id: result.id,
        name: result.title || `Company #${result.id}`,
        industry: result.subtitle,
        logoUrl: result.imageUrl
      })))
    );
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

  addAdmin(id: number, userId: number): Observable<CompanyAdmin> {
    return this.api.post(`/companies/${id}/admins`, { userId });
  }

  removeAdmin(id: number, userId: number): Observable<void> {
    return this.api.delete(`/companies/${id}/admins/${userId}`);
  }

  getPosts(id: number): Observable<Post[]> {
    return this.api.get<Post[]>(`/companies/${id}/posts`);
  }

  createPost(id: number, body: Partial<Post>): Observable<Post> {
    return this.api.post<Post>(`/companies/${id}/posts`, body);
  }

  getAnalytics(id: number): Observable<unknown> {
    return this.api.get(`/companies/${id}/analytics`);
  }

  createProduct(id: number, body: Partial<CompanyProduct>): Observable<CompanyProduct> {
    return this.api.post<CompanyProduct>(`/companies/${id}/products`, body);
  }

  updateProduct(id: number, productId: number, body: Partial<CompanyProduct>): Observable<CompanyProduct> {
    return this.api.put<CompanyProduct>(`/companies/${id}/products/${productId}`, body);
  }

  deleteProduct(id: number, productId: number): Observable<void> {
    return this.api.delete(`/companies/${id}/products/${productId}`);
  }

  getJobs(id: number): Observable<Job[]> {
    return this.api.get<Job[]>(`/companies/${id}/jobs`);
  }
}
