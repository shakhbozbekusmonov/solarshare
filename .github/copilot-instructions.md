# 🚀 AI Development Team — VS Code Copilot Edition

Bu loyiha AI agentlar jamoasi tomonidan quriladi. Har bir agent `.github/prompts/` papkasida aniqlangan.

## Team

| Agent               | Specialty                              | Copilot Command     |
| ------------------- | -------------------------------------- | ------------------- |
| 📋 project-manager  | Requirements, sprints, PRD             | `#project-manager`  |
| ⚙️ backend-lead     | Golang, PostgreSQL, Redis, APIs        | `#backend-lead`     |
| 🎨 frontend-lead    | Next.js, React TS, React Query, Tables | `#frontend-lead`    |
| 📱 mobile-lead      | Expo React Native, iOS, Android        | `#mobile-lead`      |
| 🤖 ai-engineer-lead | Python, LLMs, RAG, LangChain           | `#ai-engineer-lead` |
| 🧪 qa-engineer      | Tests, quality, bug reports            | `#qa-engineer`      |
| 🛠️ devops-lead      | Docker, CI/CD, K8s, Infrastructure     | `#devops-lead`      |
| 🔀 git-flow-lead    | Git Flow, PRs, releases, versioning    | `#git-flow-lead`    |

## Quick Usage (VS Code Copilot Chat)

```
# Butun jamoani yig'ish
#team-kickoff

# Alohida agentni chaqirish (prompt faylini tanlang)
#backend-lead — yangi orders API endpoint qo'sh
#frontend-lead — orders table sahifasini yarat
#qa-engineer — auth modul uchun testlar yoz
#devops-lead — production deployment pipeline yarat
#git-flow-lead — release/v1.2.0 tayyorla
```

## Project Tech Stack

- **Backend**: Go 1.26.0 + Fiber + sqlc + PostgreSQL + Redis
- **Frontend**: Next.js 15 + React 19 + TypeScript + React Query + React Table
- **Mobile**: Expo SDK 52 + React Native + TypeScript
- **AI**: Python 3.12 + FastAPI + LangChain + Qdrant
- **CI/CD**: GitHub Actions
- **Containers**: Docker + Docker Compose

## Standards

- TypeScript strict mode everywhere
- Go vet + golangci-lint on all Go code
- 80%+ test coverage (enforced in CI)
- Conventional commits
- No secrets in git — all in `.env` (not committed)

## Agent Orchestration Rules

1. **Har bir agent o'z sohasiga javob beradi** — backend-lead faqat Go backend, frontend-lead faqat Next.js va h.k.
2. **Agent chaqirilganda** u o'z role ichida to'liq autonomous ishlaydi
3. **Kodlar production-ready bo'lishi kerak** — har doim best practices, error handling, testing
4. **Agentlar bir-birining outputiga tayanadi** — PM → API contracts → Backend → Frontend/Mobile → QA
5. **Har bir agent o'z red flags ro'yxatiga amal qiladi** — bu qoidalar buzilmasligi kerak
