import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { SearchService } from '../../../Services/search.service';
import { SearchResult } from '../../../models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  searchQuery = '';
  showSearch = signal(false);
  typeaheadResults = signal<SearchResult[]>([]);
  showMeMenu = signal(false);

  readonly navItems = [
    { path: '/feed', label: 'Home', icon: 'home' },
    { path: '/network', label: 'My Network', icon: 'people' },
    { path: '/jobs', label: 'Jobs', icon: 'jobs' },
    { path: '/messaging', label: 'Messaging', icon: 'messaging' },
    { path: '/notifications', label: 'Notifications', icon: 'notifications' }
  ];

  onSearchInput(): void {
    const q = this.searchQuery.trim();
    if (q.length < 2) {
      this.typeaheadResults.set([]);
      return;
    }
    this.search.typeahead(q).subscribe({
      next: results => this.typeaheadResults.set(Array.isArray(results) ? results : []),
      error: () => this.typeaheadResults.set([])
    });
  }

  submitSearch(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.showSearch.set(false);
    }
  }

  selectResult(result: SearchResult): void {
    if (result.type === 'Person') {
      this.router.navigate(['/profile', result.id]);
    } else if (result.type === 'Job') {
      this.router.navigate(['/jobs', result.id]);
    } else if (result.type === 'Company') {
      this.router.navigate(['/companies', result.id]);
    }
    this.showSearch.set(false);
    this.searchQuery = '';
  }

  toggleMeMenu(): void {
    this.showMeMenu.update(v => !v);
  }

  logout(): void {
    this.auth.logout().subscribe({
      error: () => this.auth.logoutLocal()
    });
  }

  getInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();
  }
}
