import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment, Post } from '../models';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly api = inject(ApiService);

  getFeed(): Observable<Post[]> {
    return this.api.get<Post[]>('/feed');
  }

  createPost(body: Partial<Post>): Observable<Post> {
    return this.api.post<Post>('/posts', body);
  }

  uploadMedia(file: File): Observable<{ url: string; fileName: string; size: number }> {
    return this.api.upload<{ url: string; fileName: string; size: number }>('/posts/media', file);
  }

  getPost(id: number): Observable<Post> {
    return this.api.get<Post>(`/posts/${id}`);
  }

  updatePost(id: number, body: Partial<Post>): Observable<Post> {
    return this.api.put<Post>(`/posts/${id}`, body);
  }

  deletePost(id: number): Observable<void> {
    return this.api.delete(`/posts/${id}`);
  }

  react(id: number, type: string): Observable<unknown> {
    return this.api.post(`/posts/${id}/react`, { type });
  }

  removeReaction(id: number): Observable<void> {
    return this.api.delete(`/posts/${id}/react`);
  }

  getReactions(id: number): Observable<unknown[]> {
    return this.api.get(`/posts/${id}/reactions`);
  }

  addComment(id: number, text: string): Observable<Comment> {
    return this.api.post<Comment>(`/posts/${id}/comments`, { text });
  }

  getComments(id: number): Observable<Comment[]> {
    return this.api.get<Comment[]>(`/posts/${id}/comments`);
  }

  updateComment(id: number, text: string): Observable<unknown> {
    return this.api.put(`/comments/${id}`, { text });
  }

  deleteComment(id: number): Observable<void> {
    return this.api.delete(`/comments/${id}`);
  }

  replyToComment(id: number, text: string): Observable<Comment> {
    return this.api.post<Comment>(`/comments/${id}/replies`, { text });
  }

  reactToComment(id: number, type: string): Observable<unknown> {
    return this.api.post(`/comments/${id}/react`, { type });
  }

  repost(id: number, body?: Partial<Post>): Observable<Post> {
    return this.api.post<Post>(`/posts/${id}/repost`, body ?? {});
  }

  share(id: number, body: { recipientUserId?: number; groupId?: number; companyId?: number; message?: string }): Observable<unknown> {
    return this.api.post(`/posts/${id}/share`, body);
  }

  sendPost(id: number, message?: string, recipientUserId?: number): Observable<unknown> {
    return this.api.post(`/posts/${id}/send`, { message, recipientUserId });
  }

  pin(id: number): Observable<Post> {
    return this.api.post<Post>(`/posts/${id}/pin`);
  }

  save(id: number): Observable<unknown> {
    return this.api.post(`/posts/${id}/save`);
  }

  unsave(id: number): Observable<void> {
    return this.api.delete(`/posts/${id}/save`);
  }

  getSaved(): Observable<unknown[]> {
    return this.api.get('/posts/saved');
  }

  getSavedCollections(): Observable<string[]> {
    return this.api.get('/posts/saved/collections');
  }

  report(id: number, reason: string, details?: string): Observable<unknown> {
    return this.api.post(`/posts/${id}/report`, { reason, details });
  }

  createArticle(body: Partial<Post>): Observable<Post> {
    return this.api.post<Post>('/articles', body);
  }

  getArticle(id: number): Observable<Post> {
    return this.api.get<Post>(`/articles/${id}`);
  }

  updateArticle(id: number, body: Partial<Post>): Observable<Post> {
    return this.api.put<Post>(`/articles/${id}`, body);
  }

  saveDraft(body: Partial<Post>): Observable<Post> {
    return this.api.post<Post>('/posts/draft', body);
  }

  getDrafts(): Observable<Post[]> {
    return this.api.get<Post[]>('/posts/drafts');
  }

  getHashtagPosts(tag: string): Observable<unknown[]> {
    return this.api.get(`/hashtags/${tag}/posts`);
  }

  followHashtag(tag: string): Observable<unknown> {
    return this.api.post(`/hashtags/${tag}/follow`);
  }

  getTemplates(): Observable<string[]> {
    return this.api.get('/posts/templates');
  }
}
