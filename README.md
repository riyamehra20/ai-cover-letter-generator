# AI Cover Letter Generator
A SaaS utility built with React + Vite that uses the Google Gemini API to generate professional cover letters.

---

## Tech Stack
- **React 18** — UI & state management
- **Vite** — dev server & bundler
- **Google Gemini API** — LLM integration (free tier)
- **CSS Modules** — scoped styling

---

## Setup Instructions

### 1. Clone / download the project
```bash
cd cover-letter-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Get your free Gemini API Key
1. Go to: https://aistudio.google.com/app/apikey


### 4. Create your .env file
```bash
cp .env.example .env
```
Then open `.env` and paste your key:
```
VITE_GEMINI_API_KEY=paste_your_key_here
```

>  NEVER commit `.env` to GitHub. It's already in `.gitignore`.

### 5. Run the dev server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

---

## Project Structure
```
cover-letter-app/
├── .env                  ← YOUR API KEY (never commit)
├── .env.example          ← Safe template (commit this)
├── .gitignore            ← Excludes .env from git
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          ← React entry point
    ├── index.css         ← Global styles
    ├── gemini.js         ← API integration + prompt engineering
    ├── App.jsx           ← Main component + state logic
    └── App.module.css    ← Component styles
```

---

## Security Architecture
- API key stored in `.env` → loaded via `import.meta.env.VITE_GEMINI_API_KEY`
- `.env` is listed in `.gitignore` → never pushed to GitHub
- `.env.example` (no real key) is committed → teammates know what vars are needed

---

## Features
- Tag-based skill input
- "Generating..." loading state
- Copy to clipboard
- Regenerate button
- Word count display
- Error handling for missing key / API failures
