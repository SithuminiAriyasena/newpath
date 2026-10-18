# NewPath – Recovery Support (React + Tailwind + Node.js)

A simple full-stack app for people who want support to stop using drugs or alcohol.

**Stack**
- Frontend: React 18 + Vite + Tailwind CSS v4 (`client/`)
- Backend: Node.js + Express, calls the Claude API (`server/`)

**Features**
- **Talk to Sol**: AI companion chat (non-judgmental, motivational-interviewing style) with a server-side crisis keyword check that shows a safety banner
- **My Progress**: days-since-last-use counter, daily check-in, personal reasons (saved only in the browser)
- **Craving Toolkit**: guided breathing, 15-minute urge timer, quick coping actions
- **Get Help Now**: emergency guidance, helpline directory, peer-support links

## Setup

```bash
npm run install:all
cp server/.env.example server/.env     # add your ANTHROPIC_API_KEY
```

## Development (two terminals)

```bash
npm run dev:server    # API on http://localhost:3000
npm run dev:client    # React app on http://localhost:5173 (proxies /api to :3000)
```

Open http://localhost:5173

## Production (single server)

```bash
npm run build         # builds client/dist
npm start             # Express serves the API and the built React app on :3000
```

## Structure

```
server/server.js                 Express API: POST /api/chat, GET /api/health
client/src/App.jsx               Tabs and layout
client/src/components/           Chat, Progress, Toolkit, Help, Card
client/src/useLocalStorage.js    Small persistence hook
client/src/index.css             Tailwind import and theme colors
```

Without an API key the app still runs; the chat returns a basic fallback reply.

## Before you go live

- Have a clinician or addiction-support professional review Sol's system prompt in `server/server.js` and the help content.
- Add real crisis lines and treatment services for your country on the Help tab.
- Add a privacy notice. Chats aren't stored by this app, but messages are sent to the AI provider.
- Harden for production: HTTPS, a shared-store rate limiter (e.g. `express-rate-limit`), and logging that avoids message content.
- This is a support tool, not medical care. Keep the disclaimers visible.
