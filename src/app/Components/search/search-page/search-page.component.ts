import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../Services/search.service';
import { SearchResult } from '../../../models';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly search = inject(SearchService);

  query = '';
  activeFilter = signal('all');
  results = signal<SearchResult[]>([]);
  loading = signal(false);

  readonly filters = [
    { id: 'all', label: 'All' },
    { id: 'people', label: 'People' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'companies', label: 'Companies' },
    { id: 'posts', label: 'Posts' },
    { id: 'groups', label: 'Groups' }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) this.doSearch();
    });
  }

  doSearch(): void {
    const q = this.query.trim();
    if (!q) return;
    this.loading.set(true);
    const filter = this.activeFilter();

    const searchFn = filter === 'people' ? this.search.searchPeople(q)
      : filter === 'jobs' ? this.search.searchJobs(q)
      : filter === 'companies' ? this.search.searchCompanies(q)
      : filter === 'posts' ? this.search.searchPosts(q)
      : filter === 'groups' ? this.search.searchGroups(q)
      : this.search.search(q);

    searchFn.subscribe({
      next: data => {
        this.results.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(id: string): void {
    this.activeFilter.set(id);
    this.doSearch();
  }
}
