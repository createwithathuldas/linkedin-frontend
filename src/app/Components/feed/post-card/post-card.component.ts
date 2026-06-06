import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post } from '../../../models';
import { PostsService } from '../../../Services/posts.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  private readonly posts = inject(PostsService);

  post = input.required<Post>();
  updated = output<void>();

  readonly reactions = ['Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Funny'];

  getInitials(userId: number): string {
    return `U${userId}`;
  }

  formatDate(date?: string): string {
    if (!date) return 'Just now';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  }

  react(type: string): void {
    this.posts.react(this.post().id, type).subscribe({
      next: () => this.updated.emit()
    });
  }

  toggleComments = false;
  comments: { id: number; text: string; userId: number }[] = [];
  newComment = '';

  loadComments(): void {
    this.toggleComments = !this.toggleComments;
    if (this.toggleComments) {
      this.posts.getComments(this.post().id).subscribe({
        next: c => this.comments = Array.isArray(c) ? c : []
      });
    }
  }

  addComment(): void {
    const text = this.newComment.trim();
    if (!text) return;
    this.posts.addComment(this.post().id, text).subscribe({
      next: () => {
        this.newComment = '';
        this.posts.getComments(this.post().id).subscribe({
          next: c => this.comments = Array.isArray(c) ? c : []
        });
      }
    });
  }
}
