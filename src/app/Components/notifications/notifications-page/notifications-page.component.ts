import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../../../Services/notifications.service';
import { Notification } from '../../../models';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  private readonly notifications = inject(NotificationsService);

  items = signal<Notification[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.notifications.getNotifications().subscribe({
      next: data => {
        this.items.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  markRead(id: number): void {
    this.notifications.markRead(id).subscribe({ next: () => this.load() });
  }

  markAllRead(): void {
    this.notifications.markAllRead().subscribe({ next: () => this.load() });
  }
}
