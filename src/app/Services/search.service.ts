import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly api = inject(ApiService);

  search(q: string, type?: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search', { q, ...(type ? { type } : {}) });
  }

  searchPeople(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/people', { q });
  }

  searchJobs(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/jobs', { q });
  }

  searchCompanies(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/companies', { q });
  }

  searchPosts(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/posts', { q });
  }

  searchGroups(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/groups', { q });
  }

  typeahead(q: string): Observable<SearchResult[]> {
    return this.api.get<SearchResult[]>('/search/typeahead', { q });
  }

  getRecent(): Observable<unknown[]> {
    return this.api.get('/search/recent');
  }

  getSavedSearches(): Observable<unknown[]> {
    return this.api.get('/search/saved');
  }

  saveSearch(body: unknown): Observable<unknown> {
    return this.api.post('/search/saved', body);
  }

  deleteSavedSearch(id: number): Observable<void> {
    return this.api.delete(`/search/saved/${id}`);
  }
}
