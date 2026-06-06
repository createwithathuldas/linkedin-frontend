import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly api = inject(ApiService);

  getGames(): Observable<unknown[]> {
    return this.api.get('/games');
  }

  getDailyPuzzle(type: string): Observable<unknown> {
    return this.api.get(`/games/${type}/daily`);
  }

  submitAttempt(type: string, guess: string, timeTakenSeconds?: number): Observable<unknown> {
    return this.api.post(`/games/${type}/daily/attempt`, { guess, timeTakenSeconds });
  }

  getHistory(type: string): Observable<unknown[]> {
    return this.api.get(`/games/${type}/history`);
  }

  getStreak(type: string): Observable<unknown> {
    return this.api.get(`/games/${type}/streak`);
  }

  getLeaderboard(): Observable<unknown[]> {
    return this.api.get('/games/leaderboard');
  }

  shareResult(type: string): Observable<unknown> {
    return this.api.post(`/games/${type}/daily/share`);
  }
}
