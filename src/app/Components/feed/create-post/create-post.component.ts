import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { PostsService } from '../../../Services/posts.service';
import { Post } from '../../../models';

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

  // Media and Article states
  composerType: 'Text' | 'Image' | 'Video' | 'Article' = 'Text';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  articleTitle = '';

  getInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();
  }

  openComposer(type: 'Text' | 'Image' | 'Video' | 'Article' = 'Text'): void {
    this.composerType = type;
    this.showComposer.set(true);
    if (type === 'Image' || type === 'Video') {
      this.triggerFileSelect();
    }
  }

  closeComposer(): void {
    this.showComposer.set(false);
    this.content = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.articleTitle = '';
  }

  triggerFileSelect(): void {
    setTimeout(() => {
      document.getElementById('composer-file-input')?.click();
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  submit(): void {
    const text = this.content.trim();
    if (!text && !this.selectedFile && this.composerType !== 'Article') return;

    this.posting.set(true);

    if (this.selectedFile) {
      // Upload media first
      this.posts.uploadMedia(this.selectedFile).subscribe({
        next: (res) => {
          const postPayload: Partial<Post> = {
            content: text,
            type: this.composerType,
            mediaUrlsJson: JSON.stringify([res.url])
          };
          this.savePost(postPayload);
        },
        error: () => this.posting.set(false)
      });
    } else if (this.composerType === 'Article') {
      const title = this.articleTitle.trim() || 'Untitled Article';
      const postPayload: Partial<Post> = {
        content: `# ${title}\n\n${text}`,
        type: 'Article',
        linkUrl: title
      };
      this.posts.createArticle(postPayload).subscribe({
        next: () => {
          this.posting.set(false);
          this.closeComposer();
          this.created.emit();
        },
        error: () => this.posting.set(false)
      });
    } else {
      // Standard text post
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

  private savePost(payload: Partial<Post>): void {
    this.posts.createPost(payload).subscribe({
      next: () => {
        this.posting.set(false);
        this.closeComposer();
        this.created.emit();
      },
      error: () => this.posting.set(false)
    });
  }
}
