import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { PostsService } from '../../../Services/posts.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  private readonly auth = inject(AuthService);
  private readonly posts = inject(PostsService);

  readonly user = this.auth.currentUser;
  content = '';
  posting = signal(false);
  showComposer = signal(false);
  created = output<void>();

  getInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();
  }

  openComposer(): void {
    this.showComposer.set(true);
  }

  closeComposer(): void {
    this.showComposer.set(false);
    this.content = '';
  }

  submit(): void {
    const text = this.content.trim();
    if (!text) return;
    this.posting.set(true);
    this.posts.createPost({ content: text, type: 'Text' }).subscribe({
      next: () => {
        this.posting.set(false);
        this.closeComposer();
        this.created.emit();
      },
      error: () => this.posting.set(false)
    });
  }
}
