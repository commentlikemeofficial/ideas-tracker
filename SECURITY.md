# 🔒 GitHub Repo Security Protocol

**Last Updated:** 2026-01-31  
**Checked By:** Clawdbot

---

## 📋 Repo Visibility Rules

### ✅ PUBLIC Repos (Safe to Share)
These are showcase projects, templates, or open-source work:

| Repo | Visibility | Why Public |
|------|------------|------------|
| `ideas-tracker` | ✅ PUBLIC | Portfolio project, no sensitive data |

### 🔒 PRIVATE Repos (Must Stay Private)
These contain sensitive business logic, API keys, or proprietary code:

| Repo | Visibility | Why Private |
|------|------------|-------------|
| *(Add as needed)* | 🔒 PRIVATE | - |

---

## 🚨 Before Pushing - Checklist

- [ ] **No API keys** in code (check for `.env`, `config` files)
- [ ] **No credentials** (database URLs, passwords, tokens)
- [ ] **No business secrets** (revenue numbers, user data, proprietary algos)
- [ ] **No personal data** (emails, phone numbers, addresses)
- [ ] **Review `.gitignore`** - should exclude: `node_modules/`, `.env`, `dist/`, `.next/`, `*.log`
- [ ] **Check commit history** - no sensitive data in past commits
- [ ] **Confirm visibility** - is this meant to be public or private?

---

## 🔍 Quick Security Scan

Run this before any push:

```bash
# Check for common secrets
grep -r "api_key\|apikey\|password\|secret\|token" --include="*.js" --include="*.ts" --include="*.json" . 2>/dev/null | grep -v node_modules | grep -v ".env.example"

# Check for env files
git status | grep -E "\.env$|\.env\.local$|\.env\.production$"

# List all files being committed
git diff --cached --name-only
```

---

## 📊 Repo Audit Log

| Date | Action | Repo | Checked By |
|------|--------|------|------------|
| 2026-01-31 | Created | ideas-tracker | Clawdbot |
| 2026-01-31 | Verified PUBLIC | ideas-tracker | Clawdbot |

---

## 🔔 Weekly Check Reminder

**Every Monday:** Run `check-repo-security.sh` to audit all repos

```bash
#!/bin/bash
# check-repo-security.sh
echo "🔒 Repo Security Check - $(date)"
echo ""
gh repo list commentlikemeofficial --limit 50 --json name,visibility | jq -r '.[] | "\(.name): \(.visibility)"'
echo ""
echo "✅ Check complete. Review any unexpected public repos."
```

---

## 🆘 If You Accidentally Push Something Sensitive

1. **DO NOT PANIC**
2. **Rotate the exposed credentials immediately** (regenerate API keys, change passwords)
3. **Remove from GitHub history:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch path/to/file' \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push:** `git push origin --force --all`
5. **Make repo PRIVATE immediately** if needed: `gh repo edit owner/repo --visibility private`
6. **Notify relevant parties** if customer data was exposed

---

## 📞 Contact

If unsure about any repo visibility - **ASK FIRST, PUSH SECOND**.

**Remember:** It's easier to make a private repo public later than to recover from a leaked secret.

---

*"Trust but verify" - Reagan (and Rajesh)*
