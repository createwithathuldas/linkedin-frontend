import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompaniesService } from '../../../Services/companies.service';
import { JobsService } from '../../../Services/jobs.service';
import { Company, Job } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companiesService = inject(CompaniesService);
  private readonly jobsService = inject(JobsService);

  companies = signal<Company[]>([]);
  jobs = signal<Job[]>([]);
  selectedCompany = signal<Company | null>(null);
  companyAnalytics = signal<unknown>(null);
  loading = signal(false);
  message = signal('');
  error = signal('');

  openJobs = computed(() => this.jobs().filter(job => job.isOpen !== false));

  companyForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    industry: [''],
    websiteUrl: [''],
    description: ['']
  });

  adminForm = this.fb.nonNullable.group({
    companyId: [0, Validators.required],
    userId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set('');
    this.companiesService.getCompanies().subscribe({
      next: companies => {
        this.companies.set(companies);
        if (!this.selectedCompany() && companies.length) {
          this.selectCompany(companies[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load companies.');
      }
    });

    this.jobsService.getJobs().subscribe({
      next: jobs => this.jobs.set(Array.isArray(jobs) ? jobs : []),
      error: () => this.jobs.set([])
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany.set(company);
    this.adminForm.patchValue({ companyId: company.id });
    this.companiesService.getAnalytics(company.id).subscribe({
      next: data => this.companyAnalytics.set(data),
      error: () => this.companyAnalytics.set(null)
    });
  }

  createCompany(): void {
    if (this.companyForm.invalid) return;
    this.message.set('');
    this.error.set('');

    this.companiesService.createCompany(this.companyForm.getRawValue()).subscribe({
      next: company => {
        this.message.set('Company page created.');
        this.companyForm.reset();
        this.companies.update(list => [company, ...list]);
        this.selectCompany(company);
      },
      error: err => this.error.set(err?.error?.title || 'Unable to create company.')
    });
  }

  addAdmin(): void {
    if (this.adminForm.invalid) return;
    const { companyId, userId } = this.adminForm.getRawValue();
    this.message.set('');
    this.error.set('');

    this.companiesService.addAdmin(Number(companyId), Number(userId)).subscribe({
      next: () => this.message.set('Company admin added.'),
      error: err => this.error.set(err?.error?.title || 'Unable to add company admin.')
    });
  }

  closeJob(job: Job): void {
    this.jobsService.deleteJob(job.id).subscribe({
      next: () => {
        this.message.set('Job closed.');
        this.jobs.update(items => items.map(item => item.id === job.id ? { ...item, isOpen: false } : item));
      },
      error: err => this.error.set(err?.error?.title || 'Unable to close job.')
    });
  }
}
