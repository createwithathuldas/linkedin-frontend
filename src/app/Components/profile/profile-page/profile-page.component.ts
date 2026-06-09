import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../Services/users.service';
import { ConnectionsService } from '../../../Services/connections.service';
import { AuthService } from '../../../Services/auth.service';
import { Education, Experience, Skill, User } from '../../../models';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly users = inject(UsersService);
  private readonly connections = inject(ConnectionsService);
  private readonly auth = inject(AuthService);

  readonly currentUser = this.auth.currentUser;
  user = signal<User | null>(null);
  experience = signal<Experience[]>([]);
  education = signal<Education[]>([]);
  skills = signal<Skill[]>([]);
  connectionDegree = signal<number | null>(null);

  get isOwnProfile(): boolean {
    const me = this.currentUser();
    const u = this.user();
    return !!me && !!u && me.id === u.id;
  }

  // Modals state
  showEditModal = signal(false);
  editSection = signal<'header' | 'about' | 'experience' | 'education' | 'skills' | null>(null);
  
  // Header form
  editUserForm = {
    firstName: '',
    lastName: '',
    headline: '',
    location: '',
    summary: ''
  };

  // Experience form
  editExperienceForm = {
    id: undefined as number | undefined,
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  };

  // Education form
  editEducationForm = {
    id: undefined as number | undefined,
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  newSkillName = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('userId'));
      this.loadProfile(userId);
    });
  }

  loadProfile(userId: number): void {
    this.users.getUser(userId).subscribe({
      next: (data: any) => {
        this.user.set(data?.user || null);
        this.experience.set(Array.isArray(data?.experience) ? data.experience : []);
        this.education.set(Array.isArray(data?.education) ? data.education : []);
        this.skills.set(Array.isArray(data?.skills) ? data.skills : []);
      }
    });
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

  triggerBannerUpload(): void {
    document.getElementById('banner-file-input')?.click();
  }

  triggerAvatarUpload(): void {
    document.getElementById('avatar-file-input')?.click();
  }

  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const u = this.user();
    if (file && u) {
      this.users.uploadBanner(u.id, file).subscribe({
        next: () => this.loadProfile(u.id)
      });
    }
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const u = this.user();
    if (file && u) {
      this.users.uploadAvatar(u.id, file).subscribe({
        next: () => this.loadProfile(u.id)
      });
    }
  }

  openEditModal(section: 'header' | 'about'): void {
    const u = this.user();
    if (!u) return;
    this.editUserForm = {
      firstName: u.firstName,
      lastName: u.lastName,
      headline: u.headline || '',
      location: u.location || '',
      summary: u.summary || ''
    };
    this.editSection.set(section);
    this.showEditModal.set(true);
  }

  openAddModal(section: 'experience' | 'education' | 'skills'): void {
    this.editSection.set(section);
    if (section === 'experience') {
      this.editExperienceForm = {
        id: undefined,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
    } else if (section === 'education') {
      this.editEducationForm = {
        id: undefined,
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      };
    } else if (section === 'skills') {
      this.newSkillName = '';
    }
    this.showEditModal.set(true);
  }

  openEditItemModal(section: 'experience' | 'education', item: any): void {
    this.editSection.set(section);
    if (section === 'experience') {
      this.editExperienceForm = {
        id: item.id,
        title: item.title,
        company: item.company,
        location: item.location || '',
        startDate: item.startDate ? item.startDate.split('T')[0] : '',
        endDate: item.endDate ? item.endDate.split('T')[0] : '',
        current: item.current || false,
        description: item.description || ''
      };
    } else if (section === 'education') {
      this.editEducationForm = {
        id: item.id,
        school: item.school,
        degree: item.degree || '',
        fieldOfStudy: item.fieldOfStudy || '',
        startDate: item.startDate ? item.startDate.split('T')[0] : '',
        endDate: item.endDate ? item.endDate.split('T')[0] : '',
        description: item.description || ''
      };
    }
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editSection.set(null);
  }

  saveProfileChanges(): void {
    const u = this.user();
    if (!u) return;
    this.users.updateUser(u.id, this.editUserForm).subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  saveExperience(): void {
    const u = this.user();
    if (!u) return;
    const obs = this.editExperienceForm.id
      ? this.users.updateExperience(u.id, this.editExperienceForm.id, this.editExperienceForm)
      : this.users.addExperience(u.id, this.editExperienceForm);

    obs.subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  deleteExperience(id: number): void {
    const u = this.user();
    if (!u) return;
    this.users.deleteExperience(u.id, id).subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  saveEducation(): void {
    const u = this.user();
    if (!u) return;
    const obs = this.editEducationForm.id
      ? this.users.updateEducation(u.id, this.editEducationForm.id, this.editEducationForm)
      : this.users.addEducation(u.id, this.editEducationForm);

    obs.subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  deleteEducation(id: number): void {
    const u = this.user();
    if (!u) return;
    this.users.deleteEducation(u.id, id).subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  addSkill(): void {
    const u = this.user();
    const name = this.newSkillName.trim();
    if (!u || !name) return;
    this.users.addSkill(u.id, name).subscribe({
      next: () => {
        this.loadProfile(u.id);
        this.closeEditModal();
      }
    });
  }

  deleteSkill(id: number): void {
    const u = this.user();
    if (!u) return;
    this.users.deleteSkill(u.id, id).subscribe({
      next: () => this.loadProfile(u.id)
    });
  }
}
