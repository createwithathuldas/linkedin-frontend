import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  readonly news = [
    { title: 'Tech hiring surges in Q2', readers: '12,453 readers' },
    { title: 'AI skills top job listings', readers: '8,291 readers' },
    { title: 'Remote work trends 2026', readers: '5,672 readers' },
    { title: 'Startup funding roundup', readers: '4,108 readers' },
    { title: 'Leadership insights', readers: '3,890 readers' }
  ];
}
