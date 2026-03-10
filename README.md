# Ghost-Post

Ghost-Post is a SaaS platform that converts GitHub repository context (README first, commits fallback) into a 7-day social content calendar for LinkedIn and Twitter using OpenAI.

## 1) Product Goal

- Input: GitHub repository URL or technical documentation URL.
- Output: 7-day Dev-Log style content calendar.
- Audience: solo founders, developer advocates, and engineering teams.

## 2) Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI `gpt-4o`

## 3) Folder Structure (Controller-Service Pattern)

```text
Ghost-Post/
	backend/
		src/
			app.js
			controllers/
				contentController.js
			models/
				User.js
				Project.js
				Post.js
			routes/
				contentRoutes.js
			services/
				aiContentService.js
				githubService.js
				contentGenerationService.js
				connectors/
					LinkedInService.js
					TwitterService.js
	frontend/
		src/
			components/
				Dashboard.jsx
```

## 4) Data Models

### User
- Auth profile for account ownership.
- Fields: `name`, `email`, `passwordHash`, `role`, `timezone`.

### Project
- Source object linked to a user.
- Fields: `userId`, `name`, `sourceType`, `githubUrl`, `docsUrl`, `defaultPlatform`, `lastGeneratedAt`.

### Post
- Generated social unit in the calendar.
- Fields: `userId`, `projectId`, `dayIndex`, `platform`, `title`, `content`, `hashtags`, `scheduledDate`, `status`, `sourceSummary`.
- `status` enum: `draft` or `scheduled`.

## 5) API Contract

### POST `/api/generate-content`

Request:

```json
{
	"githubUrl": "https://github.com/owner/repo"
}
```

Response:

```json
{
	"project": {},
	"summary": "...",
	"sourceTypeUsed": "readme",
	"posts": []
}

### Auth

- Requires `Authorization: Bearer <jwt_token>`.

### Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

```

## 6) Core Generation Flow

1. Controller validates request payload.
2. `contentGenerationService` upserts project metadata.
3. `githubService` fetches README via GitHub API.
JWT_SECRET=required_for_auth
LINKEDIN_ACCESS_TOKEN=optional_for_connector_testing
LINKEDIN_AUTHOR_URN=optional_for_connector_testing
TWITTER_ACCESS_TOKEN=optional_for_connector_testing
4. If README fails, fallback to recent commit messages.
5. `aiContentService` sends system prompt + source text to OpenAI.
6. AI returns strict JSON with 14 posts (7 days x 2 platforms).
7. Service stores posts as drafts in MongoDB.

## 7) Environment Variables

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ghost-post
OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=optional_but_recommended
```

## 8) Intern Onboarding Checklist

### Backend Intern (API Connectors)
- Implement `LinkedInService.publishPost(post)`.
- Implement `TwitterService.publishPost(post)`.
- Add OAuth token storage in user auth domain.
- Add queue/cron for scheduled post publishing.

### Frontend Intern (Chrome Extension)
- Build extension popup to capture active tab URL.
- Send URL to backend endpoint.
- Display generated calendar cards in extension UI.
- Add auth flow to connect extension session with Ghost-Post account.

## 9) Next Features

- Multi-project workspaces per user.
- Support docs ingestion from Notion, Confluence, and markdown files.
- Post performance analytics and AI-driven rephrasing.
- Team collaboration and approval workflows.

## 10) Runbook (Suggested)

1. Create `backend/.env` from env sample.
2. Install backend dependencies:

```bash
cd backend
npm install express mongoose openai axios
```

3. Start backend:

```bash
npm run dev
```

4. Run frontend in separate terminal with your React toolchain.

## 11) Architecture Notes

- Keep controllers thin (request/response concerns only).
- Keep services pure for business logic and integrations.
- New connectors should be added only under `services/connectors`.
- This keeps core generation logic stable while integrations expand.