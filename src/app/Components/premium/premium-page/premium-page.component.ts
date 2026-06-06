import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumService } from '../../../Services/premium.service';

@Component({
  selector: 'app-premium-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-page.component.html',
  styleUrl: './premium-page.component.scss'
})
export class PremiumPageComponent implements OnInit {
  private readonly premium = inject(PremiumService);

  plans = signal<unknown[]>([]);
  status = signal<unknown>(null);
  subscribing = signal(false);

  ngOnInit(): void {
    this.premium.getPlans().subscribe({ next: p => this.plans.set(Array.isArray(p) ? p : []) });
    this.premium.getStatus().subscribe({ next: s => this.status.set(s) });
  }

  subscribe(tier: string): void {
    this.subscribing.set(true);
    this.premium.subscribe(tier).subscribe({
      next: () => {
        this.subscribing.set(false);
        this.premium.getStatus().subscribe({ next: s => this.status.set(s) });
      },
      error: () => this.subscribing.set(false)
    });
  }
}
