# Contributing to Jobify

Thank you for contributing! This guide explains our Git workflow and standards.

---

## 🌿 Branching Strategy — Gitflow

```
main          ← Production-ready code only
develop       ← Integration branch (all features merge here first)
feature/*     ← New features (branch off develop)
fix/*         ← Bug fixes
hotfix/*      ← Urgent production fixes (branch off main)
release/*     ← Release preparation
```

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Merging a Feature
1. Push your branch: `git push origin feature/your-feature-name`
2. Open a Pull Request → `develop`
3. Get at least 1 review approval
4. Squash & Merge

### Hotfixes
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# ... make fix ...
git checkout main && git merge hotfix/critical-fix
git checkout develop && git merge hotfix/critical-fix
```

---

## 💬 Commit Message Format — Conventional Commits

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code restructuring without feature change |
| `test` | Adding or updating tests |
| `ci` | CI/CD configuration changes |
| `chore` | Build process, tooling updates |
| `perf` | Performance improvements |

### Examples
```bash
git commit -m "feat(auth): add JWT refresh token support"
git commit -m "fix(jobs): resolve pagination offset bug"
git commit -m "ci: update Jenkins pipeline with security scan"
git commit -m "docs: add API endpoint documentation"
```

---

## 🔍 Pre-Commit Hooks (Husky)

We use [Husky](https://typicode.github.io/husky/) to run ESLint automatically before every commit.

If ESLint finds errors, the commit will be **blocked** until they are fixed.

```bash
# To bypass in exceptional cases (not recommended):
git commit --no-verify -m "your message"
```

---

## 🔒 Security Rules

- **Never commit** `.env` files or secrets
- **Never commit** `node_modules/`
- Use `AWS Secrets Manager` or environment variables for credentials in production
- Run `npm audit` before opening a PR

---

## 🚀 Pull Request Checklist

Before opening a PR, verify:
- [ ] Branch is based on `develop` (or `main` for hotfixes)
- [ ] Commit messages follow Conventional Commits format
- [ ] ESLint passes (`npm run lint`)
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Docker build succeeds locally (`docker compose up --build`)
- [ ] PR description explains what changed and why

---

## 🛠️ Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/jobify.git
cd jobify

# 2. Install root dependencies (Husky)
npm install

# 3. Start all services with Docker Compose
docker compose up --build

# 4. Or run locally:
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

---

## 📞 Contact

Open an issue or reach out via the repository discussions.
