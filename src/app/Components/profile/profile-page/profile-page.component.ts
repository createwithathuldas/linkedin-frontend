import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../Services/users.service';
import { ConnectionsService } from '../../../Services/connections.service';
import { Education, Experience, Skill, User } from '../../../models';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly users = inject(UsersService);
  private readonly connections = inject(ConnectionsService);

  user = signal<User | null>(null);
  experience = signal<Experience[]>([]);
  education = signal<Education[]>([]);
  skills = signal<Skill[]>([]);
  connectionDegree = signal<number | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('userId'));
      this.loadProfile(userId);
    });
  }

  loadProfile(userId: number): void {
    this.users.getUser(userId).subscribe({ next: u => this.user.set(u) });
    this.users.getExperience(userId).subscribe({ next: e => this.experience.set(Array.isArray(e) ? e : []) });
    this.users.getEducation(userId).subscribe({ next: e => this.education.set(Array.isArray(e) ? e : []) });
    this.users.getSkills(userId).subscribe({ next: s => this.skills.set(Array.isArray(s) ? s : []) });
    this.users.getConnectionDegree(userId).subscribe({
      next: d => this.connectionDegree.set(d?.degree ?? null),
      error: () => this.connectionDegree.set(null)
    });
  }

  connect(): void {
    const u = this.user();
    if (!u) return;
    this.connections.sendRequest(u.id).subscribe();
  }

  getInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();
  }
}
