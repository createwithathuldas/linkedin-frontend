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
  puzzle = signal<any>(null);
  streak = signal<any>(null);
  guess = '';
  result = signal('');
  submitting = signal(false);

  parsedPuzzle = signal<any>(null);
  sudokuGrid: string[][] = [];
  tangoGrid: string[][] = [];
  queensGrid: string[][] = [];

  ngOnInit(): void {
    this.games.getGames().subscribe({ next: g => this.gameList.set(Array.isArray(g) ? g : []) });
    this.loadPuzzle('Zip');
  }

  loadPuzzle(type: string): void {
    this.selectedType.set(type);
    this.guess = '';
    this.result.set('');
    this.games.getDailyPuzzle(type).subscribe({
      next: (p: any) => {
        this.puzzle.set(p);
        if (p?.puzzleJson) {
          try {
            const parsed = JSON.parse(p.puzzleJson);
            this.parsedPuzzle.set(parsed);

            if (type === 'MiniSudoku') {
              this.sudokuGrid = parsed.grid.map((row: any[]) => row.map(cell => cell || ''));
            } else if (type === 'Tango') {
              this.tangoGrid = parsed.grid.map((row: any[]) => row.map(cell => cell || ''));
            } else if (type === 'Queens') {
              this.queensGrid = [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', '']
              ];
            }
          } catch {
            this.parsedPuzzle.set(null);
          }
        } else {
          this.parsedPuzzle.set(null);
        }
      }
    });
    this.games.getStreak(type).subscribe({ next: s => this.streak.set(s) });
  }

  toggleTangoCell(r: number, c: number): void {
    const val = this.tangoGrid[r][c];
    if (val === '') {
      this.tangoGrid[r][c] = 'S';
    } else if (val === 'S') {
      this.tangoGrid[r][c] = 'M';
    } else {
      this.tangoGrid[r][c] = '';
    }
  }

  toggleQueenCell(r: number, c: number): void {
    const val = this.queensGrid[r][c];
    if (val === 'Q') {
      this.queensGrid[r][c] = '';
    } else {
      this.queensGrid[r][c] = 'Q';
    }
  }

  getQueenRegionColor(r: number, c: number): string {
    const colors = ['#e0f7fa', '#fff9c4', '#f1f8e9', '#ffe0b2'];
    if (this.parsedPuzzle()?.colors) {
      const colorIndex = this.parsedPuzzle().colors[r]?.[c] ?? 0;
      return colors[colorIndex % colors.length];
    }
    return '#fff';
  }

  submit(): void {
    const type = this.selectedType();
    if (type === 'Zip') {
      if (!this.guess.trim()) return;
    } else if (type === 'MiniSudoku') {
      this.guess = JSON.stringify(this.sudokuGrid.map(row => row.map(cell => cell ? parseInt(cell) : null)));
    } else if (type === 'Tango') {
      this.guess = JSON.stringify(this.tangoGrid);
    } else if (type === 'Queens') {
      const coords: number[][] = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.queensGrid[r][c] === 'Q') {
            coords.push([r, c]);
          }
        }
      }
      this.guess = JSON.stringify(coords);
    }

    this.submitting.set(true);
    this.games.submitAttempt(type, this.guess).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        if (res?.solved) {
          this.result.set('🎉 Correct! Today\'s puzzle solved successfully! Streak updated.');
        } else {
          this.result.set('❌ Incorrect guess. Try again!');
        }
        this.loadPuzzle(type);
      },
      error: () => {
        this.submitting.set(false);
        this.result.set('❌ Error submitting attempt. Try again!');
      }
    });
  }
}
