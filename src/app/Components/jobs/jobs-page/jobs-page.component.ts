import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobsService } from '../../../Services/jobs.service';
import { Job } from '../../../models';

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jobs-page.component.html',
  styleUrl: './jobs-page.component.scss'
})
export class JobsPageComponent implements OnInit {
  private readonly jobs = inject(JobsService);

  recommended = signal<Job[]>([]);
  saved = signal<Job[]>([]);
  activeTab = signal<'recommended' | 'saved'>('recommended');
  loading = signal(true);

  ngOnInit(): void {
    this.loadRecommended();
  }

  loadRecommended(): void {
    this.loading.set(true);
    this.jobs.getRecommended().subscribe({
      next: data => {
        this.recommended.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadSaved(): void {
    this.jobs.getSavedJobs().subscribe({
      next: data => this.saved.set(Array.isArray(data) ? data : [])
    });
  }

  setTab(tab: 'recommended' | 'saved'): void {
    this.activeTab.set(tab);
    if (tab === 'saved') this.loadSaved();
  }

  saveJob(id: number): void {
    this.jobs.saveJob(id).subscribe({ next: () => this.loadSaved() });
  }
}
