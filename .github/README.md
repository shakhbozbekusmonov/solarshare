# 🚀 VS Code Copilot — AI Team Orchestrator

Bu papka VS Code GitHub Copilot uchun moslangan AI agentlar jamoasi hisoblanadi.

> **Claude Code** dan **VS Code Copilot** ga migrate qilingan. Istalgan modelni (Claude, GPT-4o, Gemini, va boshqalar) ishlatishingiz mumkin.

---

## 📁 Fayl Tuzilishi

```
.github/
├── copilot-instructions.md          ← Global instructions (har doim yuklanaadi)
└── prompts/
    ├── project-manager.prompt.md    ← 📋 PM agent
    ├── backend-lead.prompt.md       ← ⚙️ Go backend agent
    ├── frontend-lead.prompt.md      ← 🎨 Next.js frontend agent
    ├── mobile-lead.prompt.md        ← 📱 Expo mobile agent
    ├── ai-engineer-lead.prompt.md   ← 🤖 Python AI agent
    ├── qa-engineer.prompt.md        ← 🧪 QA/testing agent
    └── team-kickoff.prompt.md       ← 🚀 Full team activation
```

---

## 🎯 Qanday Ishlatish

### 1. Loyihangiz root papkasiga nusxalang

```bash
# Bu .github papkasini loyihangiz root ga ko'chiring
cp -r .github/ /path/to/your-project/.github/
```

### 2. VS Code Copilot Chat da agentlarni chaqiring

VS Code Copilot Chat (`Cmd+Shift+I` yoki `Ctrl+Shift+I`) ni oching va:

```
# Bitta agentni chaqirish — # belgisi bilan prompt faylni tanlang
#backend-lead yangi users CRUD API endpoint qo'sh
#frontend-lead users table sahifasini qur
#mobile-lead login screen yarat
#qa-engineer auth module uchun testlar yoz
#ai-engineer-lead RAG pipeline qur

# Butun jamoani yig'ish
#team-kickoff
```

### 3. Model tanlash

Copilot Chat da istalgan modelni tanlashingiz mumkin:

- **Claude Opus 4** — murakkab vazifalar uchun (arxitektura, refactoring)
- **Claude Sonnet 4** — kundalik coding uchun
- **GPT-4o** — alternative sifatida
- **Gemini 2.5 Pro** — alternative sifatida

---

## 🏗️ Agent Jamoasi

| Agent              | Fayl                         | Vazifasi                           |
| ------------------ | ---------------------------- | ---------------------------------- |
| 📋 Project Manager | `project-manager.prompt.md`  | TZ/PRD → PRD, Epics, Sprint Plan   |
| ⚙️ Backend Lead    | `backend-lead.prompt.md`     | Go + Fiber + sqlc + PostgreSQL     |
| 🎨 Frontend Lead   | `frontend-lead.prompt.md`    | Next.js 15 + React Query + shadcn  |
| 📱 Mobile Lead     | `mobile-lead.prompt.md`      | Expo SDK 52 + React Native         |
| 🤖 AI Engineer     | `ai-engineer-lead.prompt.md` | Python + FastAPI + LangChain + RAG |
| 🧪 QA Engineer     | `qa-engineer.prompt.md`      | Tests across all stacks            |
| 🚀 Team Kickoff    | `team-kickoff.prompt.md`     | Full team orchestration            |

---

## 🔄 Claude Code vs VS Code Copilot — Farqlari

| Xususiyat       | Claude Code                | VS Code Copilot                      |
| --------------- | -------------------------- | ------------------------------------ |
| Agent fayllari  | `.claude/agents/*.md`      | `.github/prompts/*.prompt.md`        |
| Global config   | `CLAUDE.md`                | `.github/copilot-instructions.md`    |
| Agent chaqirish | `"Use backend-lead to..."` | `#backend-lead ...`                  |
| Model tanlash   | faqat Claude               | Claude, GPT-4o, Gemini, va boshqalar |
| Frontmatter     | `name`, `model`, `tools`   | `mode`, `description`, `tools`       |

---

## ⚡ Pro Tips

1. **Agent mode** — Copilot Chat da "Agent" mode ni tanlang (Ask emas)
2. **Multi-file edit** — Agentlar fayllarni yaratishi va tahrirlashi mumkin
3. **Terminal** — Agentlar terminal buyruqlarini ham ishga tushira oladi
4. **Context** — `#file:path/to/file` bilan qo'shimcha context bering

---

## 📋 Workflow Misol

```
# 1. PM bilan rejalashtirish
#project-manager Bu TZ ni o'qi va PRD yarat: [TZ matnini yozing]

# 2. Backend scaffold
#backend-lead docs/PRD.md va docs/API_CONTRACTS.md ga qarab backend scaffold qil

# 3. Frontend scaffold
#frontend-lead docs/API_CONTRACTS.md ga qarab frontend scaffold qil

# 4. Mobile scaffold
#mobile-lead docs/API_CONTRACTS.md ga qarab mobile app scaffold qil

# 5. Testlar
#qa-engineer backend va frontend uchun test stubs yoz

# Yoki hammasi bir vaqtda:
#team-kickoff
```
