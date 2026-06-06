import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../Services/settings.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  activeSection = signal('privacy');
  profileVisibility = 'Public';
  showActiveStatus = true;
  saving = signal(false);
  message = signal('');

  readonly sections = [
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'job-seeking', label: 'Job seeking preferences' },
    { id: 'account', label: 'Account preferences' }
  ];

  ngOnInit(): void {
    this.settings.getSettings().subscribe();
  }

  setSection(id: string): void {
    this.activeSection.set(id);
  }

  savePrivacy(): void {
    this.saving.set(true);
    this.settings.updatePrivacy({
      profileVisibility: this.profileVisibility,
      showActiveStatus: this.showActiveStatus
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('Settings saved.');
      },
      error: () => this.saving.set(false)
    });
  }
}
