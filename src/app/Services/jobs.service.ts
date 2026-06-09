import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Job, JobAlert, JobApplication } from '../models';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly api = inject(ApiService);

  getJobs(params?: Record<string, string | number | boolean>): Observable<Job[]> {
    return this.api.get<Job[]>('/jobs', params);
  }

  getJob(id: number): Observable<Job> {
    return this.api.get<Job>(`/jobs/${id}`);
  }

  createJob(body: Partial<Job>): Observable<Job> {
    return this.api.post<Job>('/jobs', body);
  }

  updateJob(id: number, body: Partial<Job>): Observable<Job> {
    return this.api.put<Job>(`/jobs/${id}`, body);
  }

  deleteJob(id: number): Observable<void> {
    return this.api.delete(`/jobs/${id}`);
  }

  apply(id: number, body: { resumeUrl?: string; coverLetter?: string; phone?: string }): Observable<unknown> {
    return this.api.post(`/jobs/${id}/apply`, body);
  }

  getApplicants(id: number): Observable<JobApplication[]> {
    return this.api.get<JobApplication[]>(`/jobs/${id}/applicants`);
  }

  updateApplicantStage(jobId: number, appId: number, stage: string): Observable<JobApplication> {
    return this.api.put(`/jobs/${jobId}/applicants/${appId}/stage`, { stage });
  }

  saveJob(id: number): Observable<unknown> {
    return this.api.post(`/jobs/${id}/save`);
  }

  unsaveJob(id: number): Observable<void> {
    return this.api.delete(`/jobs/${id}/save`);
  }

  getSavedJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/jobs/saved');
  }

  getRecommended(): Observable<Job[]> {
    return this.api.get<Job[]>('/jobs/recommended');
  }

  getRecommendedCategories(): Observable<string[]> {
    return this.api.get('/jobs/recommended/categories');
  }

  getAppliedJobs(): Observable<JobApplication[]> {
    return this.api.get('/jobs/applied');
  }

  getCategories(): Observable<string[]> {
    return this.api.get('/jobs/categories');
  }

  getJobAlerts(): Observable<JobAlert[]> {
    return this.api.get('/job-alerts');
  }

  createJobAlert(body: Partial<JobAlert>): Observable<JobAlert> {
    return this.api.post<JobAlert>('/job-alerts', body);
  }

  updateJobAlert(id: number, body: Partial<JobAlert>): Observable<JobAlert> {
    return this.api.put<JobAlert>(`/job-alerts/${id}`, body);
  }

  deleteJobAlert(id: number): Observable<void> {
    return this.api.delete(`/job-alerts/${id}`);
  }
}
