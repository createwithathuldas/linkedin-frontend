import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesService } from '../../../Services/games.service';

@Component({
  selector: 'app-games-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './games-page.component.html',
  styleUrl: './games-page.component.scss'
})
export class GamesPageComponent implements OnInit {
  private readonly games = inject(GamesService);

  gameList = signal<unknown[]>([]);
  selectedType = signal('Zip');
  puzzle = signal<unknown>(null);
  streak = signal<unknown>(null);
  guess = '';
  result = signal('');
  submitting = signal(false);

  ngOnInit(): void {
    this.games.getGames().subscribe({ next: g => this.gameList.set(Array.isArray(g) ? g : []) });
    this.loadPuzzle('Zip');
  }

  loadPuzzle(type: string): void {
    this.selectedType.set(type);
    this.games.getDailyPuzzle(type).subscribe({ next: p => this.puzzle.set(p) });
    this.games.getStreak(type).subscribe({ next: s => this.streak.set(s) });
  }

  submit(): void {
    if (!this.guess.trim()) return;
    this.submitting.set(true);
    this.games.submitAttempt(this.selectedType(), this.guess).subscribe({
      next: res => {
        this.result.set(JSON.stringify(res));
        this.submitting.set(false);
        this.guess = '';
        this.loadPuzzle(this.selectedType());
      },
      error: () => this.submitting.set(false)
    });
  }
}
