---
name: google-sheets
description: Read, write, and append data to Google Sheets using OAuth 2.0 authentication. Use for logging topics, content ideas, and work tracking — works with organization policies that block service account keys.
---

# Google Sheets Integration (OAuth 2.0)

Log topics, content ideas, and work tracking to Google Sheets. Uses OAuth 2.0 authentication (user login) instead of service account keys — compliant with organization policies.

## Setup (OAuth 2.0)

### 1. Install Dependencies

```bash
pip install gspread google-auth google-auth-oauthlib google-auth-httplib2
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Sheets API** and **Google Drive API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Select **Desktop app** as application type
7. Name it: `Clawdbot Sheets`
8. Download the client secrets JSON

### 3. Store Client Secrets

```bash
mkdir -p ~/.clawdbot
cp client_secret_*.json ~/.clawdbot/google-oauth-client.json
```

Or set environment variable:
```bash
export GOOGLE_OAUTH_CLIENT_SECRETS=/path/to/client_secrets.json
```

### 4. First Authentication (One-time)

Run any command to trigger OAuth flow:

```bash
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py create \
  --title "Test Sheet"
```

This will:
1. Open your browser
2. Ask you to sign in to Google
3. Grant permissions
4. Save refresh token locally at `~/.clawdbot/google-sheets-token.json`

**Note:** Token is tied to your Google account, not a service account.

## Commands

### Create New Log Sheet

```bash
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py create \
  --title "Content Ideas Log"
```

Returns sheet ID — save this!

### Log an Entry

```bash
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py log \
  --sheet-id YOUR_SHEET_ID \
  --topic "AI agent best practices" \
  --category "content" \
  --notes "Good for blog post"
```

### Read Sheet Data

```bash
# All data
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py read \
  --sheet-id YOUR_SHEET_ID

# Specific cell
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py read \
  --sheet-id YOUR_SHEET_ID \
  --cell A1
```

### Write to Cell

```bash
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py write \
  --sheet-id YOUR_SHEET_ID \
  --cell B5 \
  --value "Important note here"
```

### Append Row

```bash
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py append \
  --sheet-id YOUR_SHEET_ID \
  --data '["2026-01-29", "Task", "Done", "Notes"]'
```

## Use Cases

### Content Calendar

```bash
# Log content ideas as they come up
python3 scripts/sheets.py log -s SHEET_ID \
  -t "10 tips for AI agents" \
  -c "blog" \
  -n "High engagement potential"
```

### Work Log

```bash
# Track what we built
python3 scripts/sheets.py log -s SHEET_ID \
  -t "Built 8 skills in one day" \
  -c "milestone" \
  -n "humanizer, self-improving, sysadmin-toolbox, etc."
```

### Topic Repository

```bash
# Store research topics
python3 scripts/sheets.py log -s SHEET_ID \
  -t "Vector databases comparison" \
  -c "research" \
  -n "Pinecone vs Weaviate vs pgvector"
```

## Sheet Structure

Created sheets have these columns:

| Timestamp | Topic | Category | Notes |
|-----------|-------|----------|-------|
| 2026-01-29 08:00:00 | AI agents | content | Blog idea |
| 2026-01-29 09:30:00 | Skill shipped | milestone | task-master done |

## Benefits vs Local Files

| Feature | Local JSON | Google Sheets |
|---------|-----------|---------------|
| Access anywhere | ❌ | ✅ |
| Mobile friendly | ❌ | ✅ |
| Share with team | Hard | Easy |
| Visual formatting | ❌ | ✅ |
| Offline access | ✅ | Limited |
| Automation/API | ✅ | ✅ |

## Getting Sheet ID

From URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit
```

## Troubleshooting

**"Required libraries not installed"**
→ Run: `pip install gspread google-auth google-auth-oauthlib google-auth-httplib2`

**"OAuth client secrets not found"**
→ Download client secrets from Google Cloud Console and save to `~/.clawdbot/google-oauth-client.json`

**"Token expired or invalid"**
→ Delete `~/.clawdbot/google-sheets-token.json` and re-run to re-authenticate

**"API not enabled"**
→ Enable Google Sheets API in Cloud Console

**"Browser doesn't open"**
→ Use a machine with browser access for first auth, then copy token file

## Storage Locations

- **Sheet ID:** Save in `~/.clawdbot/.env` as `CONTENT_LOG_SHEET=xxx`
- **Client Secrets:** `~/.clawdbot/google-oauth-client.json` (download from Google Cloud)
- **Auth Token:** `~/.clawdbot/google-sheets-token.json` (auto-generated after first login)

## Security Note

- **Client secrets:** OAuth app credentials — treat as sensitive, don't commit to git
- **Token file:** Contains refresh token — treat as sensitive, don't commit to git
- **OAuth 2.0:** Authenticates as YOU, not a service account — sheets must be owned by or shared with your account