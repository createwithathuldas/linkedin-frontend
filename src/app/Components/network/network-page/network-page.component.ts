import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConnectionsService } from '../../../Services/connections.service';
import { ConnectionRequest, User } from '../../../models';

@Component({
  selector: 'app-network-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './network-page.component.html',
  styleUrl: './network-page.component.scss'
})
export class NetworkPageComponent implements OnInit {
  private readonly connections = inject(ConnectionsService);

  received = signal<ConnectionRequest[]>([]);
  suggestions = signal<User[]>([]);
  connectionCount = signal(0);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.connections.getReceivedRequests().subscribe({
      next: r => this.received.set(Array.isArray(r) ? r : [])
    });
    this.connections.getSuggestions().subscribe({
      next: s => this.suggestions.set(Array.isArray(s) ? s : [])
    });
    this.connections.getConnections().subscribe({
      next: c => {
        this.connectionCount.set(Array.isArray(c) ? c.length : 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  accept(id: number): void {
    this.connections.acceptRequest(id).subscribe({ next: () => this.load() });
  }

  connect(userId: number): void {
    this.connections.sendRequest(userId).subscribe({ next: () => this.load() });
  }

  dismiss(userId: number): void {
    this.connections.dismissSuggestion(userId).subscribe({ next: () => this.load() });
  }

  getInitials(user?: Partial<User> | null): string {
    if (!user) return '?';
    if (!user.firstName && !user.lastName) return 'U';
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
  }
}
