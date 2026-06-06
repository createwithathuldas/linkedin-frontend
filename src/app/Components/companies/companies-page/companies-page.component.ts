import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompaniesService } from '../../../Services/companies.service';
import { Company } from '../../../models';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './companies-page.component.html',
  styleUrl: './companies-page.component.scss'
})
export class CompaniesPageComponent implements OnInit {
  private readonly companies = inject(CompaniesService);

  list = signal<Company[]>([]);

  ngOnInit(): void {
    this.companies.getCompanies().subscribe({
      next: c => this.list.set(Array.isArray(c) ? c : [])
    });
  }

  follow(id: number): void {
    this.companies.follow(id).subscribe();
  }
}
