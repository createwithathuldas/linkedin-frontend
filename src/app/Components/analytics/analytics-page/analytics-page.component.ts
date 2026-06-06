import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../Services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  profile = signal<unknown>(null);
  posts = signal<unknown>(null);
  followers = signal<unknown>(null);

  ngOnInit(): void {
    this.analytics.getProfileAnalytics().subscribe({ next: d => this.profile.set(d) });
    this.analytics.getPostsAnalytics().subscribe({ next: d => this.posts.set(d) });
    this.analytics.getFollowersAnalytics().subscribe({ next: d => this.followers.set(d) });
  }
}
