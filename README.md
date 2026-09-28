# Shohoj Niyog — Frontend (Next.js + TypeScript + Tailwind CSS)

## 1. Quick story — *why this exists*

Imagine you're a recruiter at a growing company. You run dozens of interviews weekly and want a consistent, fast, and objective way to shortlist candidates. **Manually taking interviews,** managing techinical and human resource interviewer, asking questions, and scoring **takes too long** and produces inconsistent results.

This app solves that pain: interviewers **create sessions** (they give AI a short brief), **AI generates question/ideal-answer pairs**, candidates **submit short video answers**, the app **transcribes and scores** automatically, and recruiters review summarized scores to decide whether a candidate is `interested` or `not_interested`. And the candidate then decides whether he/she will `accept` or `reject`.

---

## 2. Goals for this repository

* **Tech stack:** Next.js (App Router), TypeScript, Tailwind CSS
* **Theming:** Global CSS variables + Tailwind;
* **Forms & validation:** react-hook-form + Zod
* **Data:** Static fixtures that mirror backend payloads (easy API swap later)
* **Component design:** Tiny, reusable components (Button, Input, Card, Loading, Empty, Error, etc.)
* **Accessibility & responsiveness** from the start

---

## 3. How to open this project on your machine

### Prerequisites
* **Node.js v18+**
* **npm / yarn / pnpm**

### Steps


#### 1. Clone the repository
```
git clone https://github.com/nafistarik/shohoj-niyog-frontend.git
```
#### 2. Go into the project folder
```
cd shohoj-niyog-frontend
```
#### 3. Install dependencies
```
npm install
or
yarn install
or
pnpm install
```
#### 4. Start the development server
```
npm run dev
or
yarn dev
or
pnpm dev
```
Now open your browser and visit:
```
http://localhost:3000
```

## 4. Pages & Routes (app/ directory, App Router)

### Public

* `/` — Landing page (hero, login as Candidate / Interviewer, About, FAQ, Contact, footer)
* `/signup` — Unified signup page: choose role (candidate/interviewer)
* `/login` — Login page

### Interviewer (authenticated & role-guarded)

* `/interviewer/dashboard` — Interviewer dashboard (sidebar + topbar)
* `/interviewer/sessions/create` — Create interview session (form + scheduled time)
* `/interviewer/sessions/[id]` — Session details (QA pairs, allowed candidates, scheduled, status)
* `/interviewer/sessions/[id]/results` — All candidate responses & scores for the session

### Candidate (authenticated & role-guarded)

* `/candidate/dashboard` — Candidate dashboard
* `/candidate/interview/[id]` — Participate page: see questions and record video answers (one-by-one or sequential UX)
* `/candidate/results` — Candidate's interview results and decisions

---

## 5. Theme & Design

* Global CSS variables (in `styles/globals.css`) provide tokens.
* Primary color palette: `0891b2` (blue), sky-blue tints and very light-white background shades.
* Tailwind config extends colors using tokens mapped to CSS variables; use utility classes + small component-level classes.

---

## 6. Validation & Forms

* Used `react-hook-form` with `zodResolver`.
* Kept Zod schemas in `lib/schemas/*` and export both `TypeOf<typeof schema>` as TS types.
* Validated on submit, show field-level errors inline with `Toast` or `Input` helper text.

Example (SessionCreate) fields: `position`, `stacks`, `level`, `allowed_candidates`, `num_questions`, `scheduled`.

---

## 7. Video recording & submission UX (candidate)

* Recorded per-question short video clips (120s). Stored each as `File` in `FormData` and POST to `/api/response/`.
* Used MediaRecorder API with fallback message for unsupported browsers.
* Presented questions one-at-a-time: reduces candidate anxiety and simplifies recording.

---

## 8. Folder structure

```
/app
  /candidate
  /interviewer
  /auth
  layout.tsx
  globals.css
/components
  /ui
  /forms
  /layout
/lib
  api
  client.ts
  schemas
/hooks
/styles
  tokens.css
/data
  auth
  sessions
  results
/public
  illustrations
  data (if you want to serve static JSON)
/tests
  unit
  e2e
```

---

## 9. Deployment

* Used Vercel for seamless Next.js deployment.

---

## 10. Contributing

Please create feature branches and open PRs. Keep commits small and self-contained.

---
