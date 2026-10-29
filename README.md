# DermoScan — Cutaneous Lesion & Rash Classification System

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ICD-10](https://img.shields.io/badge/Clinical-ICD--10--CM_Harmonized-0F6FBF.svg?style=flat)](https://www.cdc.gov/nchs/icd/icd10cm.htm)

> **Clinical Governance Disclaimer**: DermoScan is an educational AI screening demonstration system designed for dermatologic pattern recognition and morphological triage. It is not an FDA/CE-cleared diagnostic device and does not substitute for evaluation by a licensed, board-certified dermatologist.

---

## 📁 Project Architecture

```
D:\projects\New folder\
│
├── 📁 typescript-app/                                   # Full-Stack React + TypeScript Web Workstation
│   ├── src/                                             # React components, pages, hooks, services, types
│   │   ├── components/results/ResultsDashboard.tsx      # Diagnostic Dossier & 4-Quadrant Morphology Grid
│   │   ├── components/scan/Step1Upload.tsx              # Specimen Photography Intake
│   │   ├── lib/imageUtils.ts                            # HTML5 Canvas Dual-Pass Downsampling & Thumbnails
│   │   ├── services/claudeApi.ts                        # Multimodal Vision AI & Heuristic Fallback Engine
│   │   └── types/dermascan.ts                           # Strict Medical Informatics Type Definitions
│   ├── package.json                                     # Node.js project definition
│   ├── vite.config.ts                                   # Vite 6 bundler configuration
│   ├── tailwind.config.js                               # Clinical color tokens & typography
│   └── run_react_app.bat                                # 1-click local launcher
│
├── ⚡ run_typescript.bat                                # Root launcher for web application
├── 📄 .gitignore                                        # Git ignore rules
└── 📄 README.md                                         # Project documentation
```

---

## 🚀 How to Run the Application

### React + TypeScript Application (Vite)
* **Directory**: [`typescript-app/`](file:///d:/projects/New%20folder/typescript-app)
* **Prerequisites**: Node.js 18+ & npm
* **Run Command**:
  ```powershell
  cd typescript-app
  npm run dev
  ```
* *Or double-click:* [`run_typescript.bat`](file:///d:/projects/New%20folder/run_typescript.bat)
* **Local Port**: `http://localhost:3000`

---

## 🎨 Design System & Clinical Standards

The application adheres strictly to the **DermoScan Clinical Intelligence Design System**:
* **Aesthetic**: Modern diagnostic clinical workstation.
* **Palette**: Unified Clinical Blue (`#0F6FBF`), Slate Text (`#0F172A`), Neutral Cool-Blue Background (`#F8FAFC`).
* **Single Color Standard**: All diagnostic results, ICD-10 badges, confidence meters, and self-care cards strictly use the authoritative clinical blue palette.
* **Ergonomic Layout**: Swapped two-column layout with the **Diagnostic Dossier** positioned prominently on the left (width 7/12) and the **Specimen Intake Console** on the right (width 5/12).
* **Typography**: Powered by modern geometric fonts: **Plus Jakarta Sans** (headings), **Inter** (body), and **JetBrains Mono** (clinical metrics and ICD codes).
