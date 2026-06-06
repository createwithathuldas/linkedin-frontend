import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostsService } from '../../../Services/posts.service';
import { Post } from '../../../models';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [CommonModule, CreatePostComponent, PostCardComponent],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss'
})
export class FeedPageComponent implements OnInit {
  private readonly posts = inject(PostsService);

  feed = signal<Post[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading.set(true);
    this.posts.getFeed().subscribe({
      next: data => {
        this.feed.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load feed. Make sure the API is running.');
        this.loading.set(false);
      }
    });
  }
}
