import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService } from '../../../Services/messaging.service';
import { Conversation, Message } from '../../../models';

@Component({
  selector: 'app-messaging-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messaging-page.component.html',
  styleUrl: './messaging-page.component.scss'
})
export class MessagingPageComponent implements OnInit {
  private readonly messaging = inject(MessagingService);

  conversations = signal<Conversation[]>([]);
  selected = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  newMessage = '';
  loading = signal(true);

  ngOnInit(): void {
    this.messaging.getConversations().subscribe({
      next: data => {
        this.conversations.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
        if (this.conversations().length) {
          this.selectConversation(this.conversations()[0]);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  selectConversation(conv: Conversation): void {
    this.selected.set(conv);
    this.messaging.getMessages(conv.id).subscribe({
      next: msgs => this.messages.set(Array.isArray(msgs) ? msgs : [])
    });
    this.messaging.markRead(conv.id).subscribe();
  }

  send(): void {
    const conv = this.selected();
    const text = this.newMessage.trim();
    if (!conv || !text) return;
    this.messaging.sendMessage(conv.id, text).subscribe({
      next: msg => {
        this.messages.update(msgs => [...msgs, msg]);
        this.newMessage = '';
      }
    });
  }
}
