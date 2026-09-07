# TrainingGDS — Amadeus Cryptic Training Simulator & History Quiz

An offline, zero-dependency **Amadeus Selling Platform Connect** training simulator and history quiz designed for airline travel consultants and Floor Leads (FL).

---

## Overview

**TrainingGDS** provides interactive, floor-realistic simulation drills for mastering Amadeus cryptic workflows, ticket exchanges, automated/manual pricing, auxiliary service elements, and PNR audit investigations.

* **100% Offline & Client-Side:** Runs completely in the browser via `file://` or static hosting.
* **No Live GDS / No API Keys:** Self-contained declarative simulation engine with realistic Amadeus terminal output formatting.
* **No Backend or Database:** No external dependencies, server setup, or network connection required.

---

## What's Included

### 1. Amadeus Scenario Simulator (`index.html` & `dist/TrainingGDS-amadeus.html`)
Over **28 realistic practice drills** spanning 9 core categories:
- **Rebook & Exchange:** Unused ATC Inbound Rebook (`FXQ`), CAT 31 Rules Blocked Manual Fallback (`FXP`/`FQN*PE`), Partial-Used Reissues with concrete Date/Point of Issue (`FXX/R,01NOV24,UP,STO/S2,4` and `FXP`), Lowest Class Rebooking (`FXO`), TST Auditing (`TQT`/`TTE/ALL`).
- **Fare Rules:** Display Fare Rules Menu (`FQN1`), Penalties & Change Fees (`FQN1*PE`), Voluntary Changes & ATC Conditions (`FQN1*VC`).
- **Baggage & Fare Family:** Stored Ticket History (`TTH`), Fare Family Brand Audit (`TTH/T1` / `AFF-ECOSTAND`), Drop-Baggage Trap & Filter Repricing (`FXQ/S…/R,UP/FF-ECOSTAND`).
- **Void & Cancellation:** Same-day Void & Rebook (`TRDC`), Standalone Void (`TRDC`), Policy Audit (`HEETT`), Itinerary Cancellation (`XA`).
- **Refund:** Automated GDS Refund (`TRF/ATC`), Tax-only Refund (`TRF/TAX`).
- **Passenger & Names:** Split PNR (`SP`), Infant without Seat (`NM1 SURNAME/FIRST(INF//DOB)`).
- **Ancillaries & SSR:** Baggage SSR (`XBAG`), Seat Map & Assignment (`SM`/`ST`), Special Meals (`SR VGML`), Wheelchair Assistance (`SR WCHR`), EMD Display (`EWD`/`TQM`).
- **APIS & Contacts:** Secure Flight & Contact Info (`SRDOCS`, `SRCTCE`, `SRCTCM`).
- **History & Queue:** PNR History Auditing (`RHI`, `RHFA`, `RHA`), Ignore/Redisplay (`IG`/`IR`).

### 2. GDS History + Commands Quiz (`quiz-history-gds.html`)
A **30-question multiple choice quiz (MCQ)** covering:
- Cryptic commands: `RHA`, `RHI`, `DO`, `DMI`, `ERK`, `RTTN`, `TWD`, `RTN`, `RTG`, `TTE/ALL`, `IG`, `IR`, `DM`.
- History codes: `SC`, `AS`, `XS`, `RF`, `CS`, `H-` element numbers.
- Status codes & traps: `TK`, `UN`, `HK`, and the floor trap *“HK now ≠ never SC”*.
- Attribution: Airline schedule change (`1A/ASC`/`PLT`) vs. Agency Office ID vs. `TOUCHLESS` robotic automation.
- Floor mini-cases: Involuntary schedule changes, empty ticketing tool (Edvin) escalations, voluntary vs. involuntary dispute audits.
- Features dual modes: **Instant Reveal** (with detailed floor explanations) and **Exam Mode** (score summary at end).

### 3. Portable Single-File Bundles
- `dist/TrainingGDS-amadeus.html` — All modular CSS, JavaScript, and scenarios bundled into a single file for easy offline USB distribution.
- `quiz-history-gds.html` — Self-contained single-file quiz application.

---

## How to Run

### Option A: Local Offline Use (`file://`)
Simply double-click any of the following files in your web browser:
1. `index.html` — Modular source version.
2. `dist/TrainingGDS-amadeus.html` — Bundled single-file version.
3. `quiz-history-gds.html` — History & commands quiz.

### Option B: Local Web Server (Optional)
If preferred, serve the directory using any static file server:
```bash
# Using Node.js
npx serve .

# Using Python
python -m http.server 8000
```

### Option C: GitHub Pages
Host the repository directly on GitHub Pages:
- Point Pages source to the root branch (`/`) or `/dist` folder.
- Access the app via your GitHub Pages URL (e.g. `https://<username>.github.io/TrainingGDS/`).

---

## Building the Portable Bundle

To rebuild the single-file distribution bundle after modifying modular scenarios or styles:

```bash
# Rebuilds dist/TrainingGDS-amadeus.html and root copy
node build-portable.js

# Rebuilds quiz-history-gds.html and dist/quiz-history-gds.html
node build-quiz.js
```

---

## Project Structure

```text
TrainingGDS/
├── index.html                   # Modular simulator application shell
├── quiz-history-gds.html        # Portable GDS History + Commands Quiz
├── TrainingGDS-amadeus-portable.html # Root convenience copy of portable bundle
├── build-portable.js            # Node bundler for portable simulator
├── build-quiz.js                # Node generator for history quiz
├── css/
│   ├── theme.css                # Color tokens, typography, terminal styling
│   └── layout.css               # Grid layout, panels, responsiveness
├── js/
│   ├── format.js                # Shared Amadeus cryptic line formatters
│   ├── engine.js                # Declarative scenario execution engine
│   └── app.js                   # Application UI controller and keyboard handling
├── scenarios/                   # 28 declarative scenario definitions (*.js)
└── dist/
    ├── TrainingGDS-amadeus.html  # Portable single-file simulator
    └── quiz-history-gds.html     # Portable single-file quiz
```

---

## Security & Compliance

* **No Credentials Stored:** This repository contains no passwords, API tokens, or personal identifiers.
* **No Real PNRs:** All names, ticket numbers, and record locators are simulated fictional test data.
* **No External Requests:** No live airline GDS network calls are executed.
