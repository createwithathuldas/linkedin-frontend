import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobsService } from '../../../Services/jobs.service';
import { Job } from '../../../models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobs = inject(JobsService);

  job = signal<Job | null>(null);
  applying = signal(false);
  applied = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.jobs.getJob(id).subscribe({
      next: j => this.job.set(j)
    });
  }

  apply(): void {
    const j = this.job();
    if (!j) return;
    this.applying.set(true);
    this.jobs.apply(j.id, { coverLetter: 'I am interested in this position.' }).subscribe({
      next: () => {
        this.applying.set(false);
        this.applied.set(true);
      },
      error: () => this.applying.set(false)
    });
  }
}
