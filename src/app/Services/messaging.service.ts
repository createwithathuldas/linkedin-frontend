import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Conversation, Message } from '../models';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly api = inject(ApiService);

  getConversations(): Observable<Conversation[]> {
    return this.api.get<Conversation[]>('/conversations');
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return this.api.get<Message[]>(`/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: number, text: string): Observable<Message> {
    return this.api.post<Message>(`/conversations/${conversationId}/messages`, { text });
  }

  deleteMessage(id: number): Observable<void> {
    return this.api.delete(`/messages/${id}`);
  }

  reactToMessage(id: number, type: string): Observable<unknown> {
    return this.api.post(`/messages/${id}/react`, { type });
  }

  markRead(conversationId: number): Observable<unknown> {
    return this.api.post(`/conversations/${conversationId}/read`);
  }

  mute(conversationId: number): Observable<unknown> {
    return this.api.post(`/conversations/${conversationId}/mute`);
  }

  archive(conversationId: number): Observable<unknown> {
    return this.api.post(`/conversations/${conversationId}/archive`);
  }

  deleteConversation(id: number): Observable<void> {
    return this.api.delete(`/conversations/${id}`);
  }

  createGroupConversation(title: string, memberIds: number[]): Observable<Conversation> {
    return this.api.post<Conversation>('/conversations/group', { title, memberIds });
  }

  addMember(conversationId: number, userId: number): Observable<unknown> {
    return this.api.post(`/conversations/${conversationId}/members`, { userId });
  }

  removeMember(conversationId: number, userId: number): Observable<void> {
    return this.api.delete(`/conversations/${conversationId}/members/${userId}`);
  }

  sendInMail(body: { recipientUserId: number; subject: string; text: string }): Observable<unknown> {
    return this.api.post('/inmail', body);
  }

  getInMailCredits(): Observable<{ credits: number }> {
    return this.api.get('/inmail/credits');
  }
}
