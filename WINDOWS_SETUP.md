# Tdex Campaign Studio — Windows Installation & Launch Guide

**Institutional Role:** Internal Phase 1 Content & Newsletter Drafting Workshop (**Machine 1 — Windows PC**).  
**Governance Boundary:** Standalone drafting software. Cannot modify official Tdex documents, issue DILOS authorizations, or impersonate the institutional Columbo (Dexter) or Pipito (Pip) verification systems. All Tdex outputs enforce **Rule #0** (*Active Development / Pre-Ratification Status*).

---

## 1. Prerequisites on Windows 10 / 11

1. Install **Node.js 20 LTS or newer** (v20.x, v22.x, or v24.x) from [https://nodejs.org](https://nodejs.org).
2. Open **PowerShell** or **Command Prompt (`cmd.exe`)** and confirm Node is installed:
   ```bat
   node -v
   npm -v
   ```

---

## 2. One-Time Setup

1. Extract the **Tdex Campaign Studio** ZIP archive to a local folder on Machine 1 (for example, `C:\Tdex\tdex-campaign-studio`).
2. Open **PowerShell** or **Command Prompt** in that folder:
   ```bat
   cd C:\Tdex\tdex-campaign-studio
   ```
3. Install dependencies:
   ```bat
   npm install
   ```
4. Create your local `.env` configuration file by copying `.env.example`:
   - **Command Prompt (`cmd.exe`):**
     ```bat
     copy .env.example .env
     ```
   - **PowerShell:**
     ```powershell
     Copy-Item .env.example .env
     ```
5. Open `.env` in **Notepad** (`notepad .env`) and paste your Gemini API key on the `GEMINI_API_KEY=` line:
   ```ini
   GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"
   PORT=3000
   APP_URL="http://localhost:3000"
   VITE_DISABLE_CLOUD_SYNC="true"
   ```
   - **Security Note:** `GEMINI_API_KEY` stays strictly on the local Node.js server (`server.ts` / `server.mjs`) and is never sent to the browser.
   - **Local-Only Storage Note:** Setting `VITE_DISABLE_CLOUD_SYNC="true"` disables optional Google Sign-In / Cloud Firestore synchronization completely so drafts remain strictly in local browser storage on Machine 1.

---

## 3. Production Build & Launch (Recommended for Daily Use)

1. Build the production frontend (`dist/`) and standalone Node 20+ server bundle (`server.mjs`):
   ```bat
   npm run build
   ```
2. Start the production server (works identically in Command Prompt and PowerShell on Node.js 20+):
   ```bat
   npm run start:prod
   ```
3. Open your web browser and go to:
   ```text
   http://localhost:3000
   ```
4. To stop the server when finished, click inside the terminal window and press **`Ctrl + C`**.

---

## 4. Development Mode (Optional — For Code Inspection)

If an engineer is inspecting or testing source files live:
```bat
npm run dev
```
And to run static TypeScript verification:
```bat
npm run lint
```

---

## 5. Required Operational Workflow (Dexter / Columbo → Pipito / Pip)

1. Draft your preview email in **Campaign Studio**, check the **Body Copy → Family Readability Check** score (target `60+` Reading Ease / Grade 7–8), and click **Simplify for Families** if needed.
2. Export the draft using **Download `.html`** or **Download PNG** (or **Offline Bundle Download**).
3. Route any public-facing communication through your real **Machine 1 Dexter (Columbo) → Pip (Pipito) → Human Founder** review workflow before external publication.
