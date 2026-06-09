import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompaniesService } from '../../../Services/companies.service';
import { JobsService } from '../../../Services/jobs.service';
import { Company, Job, JobApplication } from '../../../models';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss'
})
export class CompanyDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companiesService = inject(CompaniesService);
  private readonly jobsService = inject(JobsService);

  companies = signal<Company[]>([]);
  selectedCompany = signal<Company | null>(null);
  jobs = signal<Job[]>([]);
  selectedJob = signal<Job | null>(null);
  applicants = signal<JobApplication[]>([]);
  analytics = signal<unknown>(null);
  message = signal('');
  error = signal('');
  loading = signal(false);

  readonly stages = ['Applied', 'Viewed', 'InReview', 'PhoneScreen', 'Interview', 'Offer', 'Rejected'];
  readonly jobTypes = ['FullTime', 'PartTime', 'Contract', 'Temporary', 'Internship', 'Volunteer'];
  readonly workplaceTypes = ['OnSite', 'Hybrid', 'Remote'];
  readonly experienceLevels = ['Internship', 'EntryLevel', 'Associate', 'MidSenior', 'Director', 'Executive'];

  openJobs = computed(() => this.jobs().filter(job => job.isOpen !== false));

  companyForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    industry: [''],
    websiteUrl: [''],
    description: ['']
  });

  jobForm = this.fb.nonNullable.group({
    companyId: [0, Validators.required],
    title: ['', Validators.required],
    location: [''],
    jobType: ['FullTime', Validators.required],
    workplaceType: ['Remote', Validators.required],
    experienceLevel: ['EntryLevel', Validators.required],
    description: ['', Validators.required],
    skillsJson: ['']
  });

  postForm = this.fb.nonNullable.group({
    content: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.companiesService.getCompanies().subscribe({
      next: companies => {
        this.companies.set(companies);
        this.loading.set(false);
        if (companies.length) {
          this.selectCompany(companies[0]);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load company pages.');
      }
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany.set(company);
    this.jobForm.patchValue({ companyId: company.id });
    this.loadCompanyJobs(company.id);
    this.loadAnalytics(company.id);
  }

  createCompany(): void {
    if (this.companyForm.invalid) return;
    this.clearStatus();

    this.companiesService.createCompany(this.companyForm.getRawValue()).subscribe({
      next: company => {
        this.message.set('Company page created.');
        this.companyForm.reset();
        this.companies.update(items => [company, ...items]);
        this.selectCompany(company);
      },
      error: err => this.error.set(err?.error?.title || 'Unable to create company page.')
    });
  }

  createJob(): void {
    if (this.jobForm.invalid) return;
    this.clearStatus();
    const raw = this.jobForm.getRawValue();
    const skills = raw.skillsJson
      ? JSON.stringify(raw.skillsJson.split(',').map(skill => skill.trim()).filter(Boolean))
      : '';

    this.jobsService.createJob({ ...raw, skillsJson: skills }).subscribe({
      next: job => {
        this.message.set('Job posted.');
        this.jobs.update(items => [job, ...items]);
        this.selectedJob.set(job);
        this.applicants.set([]);
        this.jobForm.patchValue({
          title: '',
          location: '',
          description: '',
          skillsJson: '',
          jobType: 'FullTime',
          workplaceType: 'Remote',
          experienceLevel: 'EntryLevel'
        });
      },
      error: err => this.error.set(err?.error?.title || 'Unable to post job.')
    });
  }

  loadCompanyJobs(companyId: number): void {
    this.companiesService.getJobs(companyId).subscribe({
      next: jobs => {
        this.jobs.set(Array.isArray(jobs) ? jobs : []);
        this.selectedJob.set(jobs?.[0] ?? null);
        if (jobs?.[0]) {
          this.loadApplicants(jobs[0]);
        } else {
          this.applicants.set([]);
        }
      },
      error: () => this.jobs.set([])
    });
  }

  loadApplicants(job: Job): void {
    this.selectedJob.set(job);
    this.jobsService.getApplicants(job.id).subscribe({
      next: applicants => this.applicants.set(Array.isArray(applicants) ? applicants : []),
      error: () => this.applicants.set([])
    });
  }

  moveApplicant(applicant: JobApplication, stage: string): void {
    const job = this.selectedJob();
    if (!job) return;
    this.clearStatus();

    this.jobsService.updateApplicantStage(job.id, applicant.id, stage).subscribe({
      next: updated => {
        this.message.set('Applicant stage updated.');
        this.applicants.update(items => items.map(item => item.id === applicant.id ? { ...item, stage: updated.stage ?? stage } : item));
      },
      error: err => this.error.set(err?.error?.title || 'Unable to update applicant stage.')
    });
  }

  closeJob(job: Job): void {
    this.clearStatus();
    this.jobsService.deleteJob(job.id).subscribe({
      next: () => {
        this.message.set('Job closed.');
        this.jobs.update(items => items.map(item => item.id === job.id ? { ...item, isOpen: false } : item));
      },
      error: err => this.error.set(err?.error?.title || 'Unable to close job.')
    });
  }

  publishCompanyPost(): void {
    const company = this.selectedCompany();
    if (!company || this.postForm.invalid) return;
    this.clearStatus();

    this.companiesService.createPost(company.id, this.postForm.getRawValue()).subscribe({
      next: () => {
        this.message.set('Company update published.');
        this.postForm.reset();
        this.loadAnalytics(company.id);
      },
      error: err => this.error.set(err?.error?.title || 'Unable to publish company update.')
    });
  }

  private loadAnalytics(companyId: number): void {
    this.companiesService.getAnalytics(companyId).subscribe({
      next: data => this.analytics.set(data),
      error: () => this.analytics.set(null)
    });
  }

  private clearStatus(): void {
    this.message.set('');
    this.error.set('');
  }
}
