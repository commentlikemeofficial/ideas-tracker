#!/usr/bin/env python3
"""Helper script for Google Sheets OAuth authentication"""
import os
import json
from pathlib import Path

CONFIG_DIR = Path.home() / '.clawdbot'
CLIENT_SECRETS_PATH = CONFIG_DIR / 'google-oauth-client.json'
TOKEN_PATH = CONFIG_DIR / 'google-sheets-token.json'

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly'
]

def main():
    if not CLIENT_SECRETS_PATH.exists():
        print(f"Error: {CLIENT_SECRETS_PATH} not found")
        return
    
    # Load client secrets to get client_id
    with open(CLIENT_SECRETS_PATH) as f:
        secrets = json.load(f)
    
    client_id = secrets['installed']['client_id']
    
    # Build auth URL
    auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"response_type=code&"
        f"client_id={client_id}&"
        f"redirect_uri=urn:ietf:wg:oauth:2.0:oob&"
        f"scope={'%20'.join(SCOPES)}&"
        f"prompt=consent&"
        f"access_type=offline"
    )
    
    print("="*60)
    print("🔐 Google Sheets OAuth Setup")
    print("="*60)
    print("\n1. Open this URL in your browser:\n")
    print(auth_url)
    print("\n2. Sign in with your Google account")
    print("3. Click 'Allow' to authorize")
    print("4. Copy the authorization code shown")
    print("5. Run the sheets command and enter the code when prompted\n")

if __name__ == "__main__":
    main()