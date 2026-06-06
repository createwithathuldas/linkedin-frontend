# LinkedIn Frontend (Angular)

Angular 19 frontend for the LinkedIn Clone .NET API (220 endpoints). Designed to match LinkedIn's UI with a three-column layout, global navigation, and feature modules mapped to backend API tags.

## Prerequisites

- Node.js 18+
- LinkedIn API running at `http://localhost:5095`

## Quick Start

```bash
cd linkedin-frontend
npm install
npm start
```

Open `http://localhost:4200`. The dev server proxies `/api` and `/media` to the backend.

## Project Structure

```
src/app/
├── Components/          # All UI components by feature
│   ├── layout/          # Header, sidebars, main shell
│   ├── auth/            # Login, register, OTP verify
│   ├── feed/            # Feed, posts, create post
│   ├── network/         # Connections & suggestions
│   ├── jobs/            # Job search & detail
│   ├── messaging/       # Conversations & messages
│   ├── notifications/   # Notification center
│   ├── profile/         # User profile pages
│   ├── search/          # Unified search
│   ├── settings/        # Privacy & account settings
│   ├── premium/         # Premium subscription
│   ├── analytics/       # Profile/post analytics
│   ├── games/           # Daily puzzles
│   ├── groups/          # Groups discovery
│   └── companies/       # Company pages
├── Services/            # API services (1 per backend tag)
├── modules/             # Lazy-loaded route modules
├── core/                # Guards & HTTP interceptors
└── models/              # TypeScript interfaces
```

## API Service Mapping

| Service | Backend Tag | Key Endpoints |
|---------|-------------|---------------|
| `AuthService` | Auth | register, login, verify-otp, refresh, logout |
| `PostsService` | Posts | feed, posts CRUD, react, comment, repost, save |
| `UsersService` | Users | profile, experience, education, skills |
| `ConnectionsService` | Connections, Follow | requests, suggestions, follow |
| `MessagingService` | Messaging | conversations, messages, inmail |
| `JobsService` | Jobs | list, apply, save, recommended |
| `CompaniesService` | Companies | CRUD, follow, posts, jobs |
| `GroupsService` | Groups | join, members, suggested |
| `NotificationsService` | Notifications | list, read, preferences |
| `SearchService` | Search | unified, people, jobs, typeahead |
| `SettingsService` | Settings | privacy, notifications, account |
| `PremiumService` | Premium | plans, subscribe, status |
| `AnalyticsService` | Analytics | profile, posts, followers |
| `GamesService` | Games | daily puzzle, attempt, streak |

## Git Branches

Each feature has a dedicated branch for review before merge:

- `main` — full application
- `feature/core-infrastructure` — layout, styles, API base, guards
- `feature/auth` — authentication flow
- `feature/feed-posts-media` — feed & posts
- `feature/profile` — user profiles
- `feature/connections-network` — my network
- `feature/messaging` — messaging
- `feature/jobs` — jobs
- `feature/companies` — companies
- `feature/groups` — groups
- `feature/notifications` — notifications
- `feature/search` — search
- `feature/settings` — settings
- `feature/premium` — premium
- `feature/analytics` — analytics
- `feature/games` — games

## Auth Flow

1. Register → OTP email verification → auto-login
2. Login → JWT stored in localStorage → Bearer token on all API calls
3. Protected routes use `authGuard`; auth pages use `guestGuard`
