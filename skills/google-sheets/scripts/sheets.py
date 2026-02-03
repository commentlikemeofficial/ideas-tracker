#!/usr/bin/env python3
"""
google-sheets: Read, write, and append data to Google Sheets using OAuth 2.0
"""
import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

# Try to import required libraries
try:
    import gspread
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    GSPREAD_AVAILABLE = True
except ImportError:
    GSPREAD_AVAILABLE = False

# Configuration
CONFIG_DIR = Path.home() / '.clawdbot'
CLIENT_SECRETS_PATH = os.environ.get('GOOGLE_OAUTH_CLIENT_SECRETS',
                                     str(CONFIG_DIR / 'google-oauth-client.json'))
TOKEN_PATH = CONFIG_DIR / 'google-sheets-token.json'

# OAuth 2.0 scopes
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'  # Full drive access for creating sheets
]

def get_credentials():
    """Get or refresh OAuth 2.0 credentials."""
    creds = None
    
    # Load existing token if available
    if TOKEN_PATH.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
        except Exception as e:
            print(f"Warning: Could not load token: {e}")
    
    # If no valid credentials, run OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Error refreshing token: {e}")
                creds = None
        
        if not creds:
            if not os.path.exists(CLIENT_SECRETS_PATH):
                print(f"Error: OAuth client secrets not found at {CLIENT_SECRETS_PATH}")
                print("\nTo set up OAuth 2.0:")
                print("1. Go to https://console.cloud.google.com/apis/credentials")
                print("2. Create OAuth 2.0 Client ID (Desktop app)")
                print("3. Download JSON and save to the path above")
                print("4. Run this script again to authenticate")
                return None
            
            try:
                from google_auth_oauthlib.flow import Flow
                
                # Use console flow for headless environments
                flow = Flow.from_client_secrets_file(
                    CLIENT_SECRETS_PATH, 
                    SCOPES,
                    redirect_uri='urn:ietf:wg:oauth:2.0:oob'
                )
                
                # Get authorization URL
                auth_url, _ = flow.authorization_url(prompt='consent')
                
                print("\n" + "="*60)
                print("🔐 Google Sheets Authentication Required")
                print("="*60)
                print("\n1. Open this URL in your browser:")
                print(f"\n{auth_url}\n")
                print("2. Sign in and authorize access")
                print("3. Copy the authorization code")
                print("4. Paste it below:\n")
                
                auth_code = input("Authorization code: ").strip()
                
                flow.fetch_token(code=auth_code)
                creds = flow.credentials
                
            except Exception as e:
                print(f"Error during OAuth flow: {e}")
                return None
        
        # Save the credentials for future runs
        TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())
        print(f"✅ Credentials saved to {TOKEN_PATH}")
    
    return creds

def get_client():
    """Get authenticated Google Sheets client."""
    if not GSPREAD_AVAILABLE:
        print("Error: Required libraries not installed.")
        print("Run: pip install gspread google-auth google-auth-oauthlib google-auth-httplib2")
        return None
    
    creds = get_credentials()
    if not creds:
        return None
    
    try:
        client = gspread.authorize(creds)
        return client
    except Exception as e:
        print(f"Error authenticating: {e}")
        return None

def read_sheet(sheet_id, range_name=None):
    """Read data from a sheet."""
    client = get_client()
    if not client:
        return None
    
    try:
        sheet = client.open_by_key(sheet_id)
        worksheet = sheet.sheet1
        
        if range_name:
            data = worksheet.acell(range_name).value
        else:
            data = worksheet.get_all_records()
        
        return data
    except Exception as e:
        print(f"Error reading sheet: {e}")
        return None

def write_cell(sheet_id, cell, value):
    """Write to a specific cell."""
    client = get_client()
    if not client:
        return False
    
    try:
        sheet = client.open_by_key(sheet_id)
        worksheet = sheet.sheet1
        worksheet.update_acell(cell, value)
        print(f"✅ Updated {cell} with: {value}")
        return True
    except Exception as e:
        print(f"Error writing: {e}")
        return False

def append_row(sheet_id, row_data):
    """Append a row to the sheet."""
    client = get_client()
    if not client:
        return False
    
    try:
        sheet = client.open_by_key(sheet_id)
        worksheet = sheet.sheet1
        worksheet.append_row(row_data)
        print(f"✅ Appended row: {row_data}")
        return True
    except Exception as e:
        print(f"Error appending: {e}")
        return False

def log_entry(sheet_id, topic, category="general", notes=""):
    """Log an entry with timestamp."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    row = [timestamp, topic, category, notes]
    return append_row(sheet_id, row)

def list_worksheets(sheet_id):
    """List all worksheets in a spreadsheet."""
    client = get_client()
    if not client:
        return None
    
    try:
        sheet = client.open_by_key(sheet_id)
        return [ws.title for ws in sheet.worksheets()]
    except Exception as e:
        print(f"Error listing worksheets: {e}")
        return None

def create_sheet(title, folder_id=None):
    """Create a new spreadsheet."""
    client = get_client()
    if not client:
        return None
    
    try:
        sheet = client.create(title, folder_id=folder_id)
        # Add headers
        sheet.sheet1.append_row(["Timestamp", "Topic", "Category", "Notes"])
        print(f"✅ Created sheet: {title}")
        print(f"📋 Sheet ID: {sheet.id}")
        print(f"🔗 URL: https://docs.google.com/spreadsheets/d/{sheet.id}/edit")
        return sheet.id
    except Exception as e:
        print(f"Error creating sheet: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Google Sheets Integration")
    parser.add_argument("command", choices=["read", "write", "append", "log", "list", "create"])
    parser.add_argument("--sheet-id", "-s", help="Google Sheet ID (not needed for 'create')")
    parser.add_argument("--cell", "-c", help="Cell reference (e.g., A1)")
    parser.add_argument("--value", "-v", help="Value to write")
    parser.add_argument("--topic", "-t", help="Topic for logging")
    parser.add_argument("--category", default="general", help="Category")
    parser.add_argument("--notes", "-n", default="", help="Additional notes")
    parser.add_argument("--data", "-d", help="JSON array for row data")
    parser.add_argument("--title", help="Title for new sheet")
    
    args = parser.parse_args()
    
    # Validate sheet_id requirement
    if args.command != "create" and not args.sheet_id:
        print("Error: --sheet-id is required for this command")
        sys.exit(1)
    
    if args.command == "read":
        data = read_sheet(args.sheet_id, args.cell)
        if data:
            print(json.dumps(data, indent=2) if isinstance(data, list) else data)
    
    elif args.command == "write":
        if not args.cell or not args.value:
            print("Error: --cell and --value required")
            sys.exit(1)
        write_cell(args.sheet_id, args.cell, args.value)
    
    elif args.command == "append":
        if not args.data:
            print("Error: --data required (JSON array)")
            sys.exit(1)
        row = json.loads(args.data)
        append_row(args.sheet_id, row)
    
    elif args.command == "log":
        if not args.topic:
            print("Error: --topic required")
            sys.exit(1)
        log_entry(args.sheet_id, args.topic, args.category, args.notes)
    
    elif args.command == "list":
        worksheets = list_worksheets(args.sheet_id)
        if worksheets:
            for ws in worksheets:
                print(f"  • {ws}")
    
    elif args.command == "create":
        if not args.title:
            print("Error: --title required")
            sys.exit(1)
        create_sheet(args.title)

if __name__ == "__main__":
    main()