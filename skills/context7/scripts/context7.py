#!/usr/bin/env python3
"""
Context7 API Client
Fetch up-to-date library documentation
Note: Context7 requires API key or specific access. This is a template implementation.
"""

import argparse
import json
import sys
import os

# Context7 API base URL
BASE_URL = "https://context7.com/api/v1"

def get_api_key():
    """Get API key from environment"""
    return os.environ.get("CONTEXT7_API_KEY", "")

def search_libraries(query):
    """Search for libraries on Context7"""
    print(f"\nSearching Context7 for: '{query}'")
    print("\nNote: Context7 API requires authentication.")
    print("Set CONTEXT7_API_KEY environment variable to use.")
    print("\nCommon library IDs:")
    print("  /vercel/next.js - Next.js documentation")
    print("  /facebook/react - React documentation")
    print("  /supabase/supabase - Supabase documentation")
    print("  /tailwindlabs/tailwindcss - Tailwind CSS")

def get_context(lib_id, query, output_type="txt", max_tokens=None):
    """Fetch documentation context for a library"""
    api_key = get_api_key()
    
    if not api_key:
        print(f"\nContext7 API requires authentication.")
        print(f"Library: {lib_id}")
        print(f"Query: {query}")
        print(f"\nSet CONTEXT7_API_KEY environment variable to fetch documentation.")
        print(f"Get your key at: https://context7.com")
        return
    
    # Would make actual API call here with authentication
    print(f"\nFetching context for: {query}")
    print(f"Library: {lib_id}")
    print("\n[API call would happen here with valid key]")

def list_libraries():
    """List popular libraries"""
    print("\nPopular libraries on Context7:\n")
    libraries = [
        ("/vercel/next.js", "Next.js", "React framework"),
        ("/facebook/react", "React", "UI library"),
        ("/supabase/supabase", "Supabase", "Firebase alternative"),
        ("/tailwindlabs/tailwindcss", "Tailwind CSS", "CSS framework"),
        ("/prisma/prisma", "Prisma", "Database toolkit"),
        ("/typescript/typescript", "TypeScript", "Type system"),
    ]
    
    for lib_id, name, desc in libraries:
        print(f"  {lib_id:<35} - {name} ({desc})")

def main():
    parser = argparse.ArgumentParser(
        description="Context7 API Client - Fetch library documentation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s search "next.js"
  %(prog)s context "/vercel/next.js" "app router middleware"
  %(prog)s list

Setup:
  export CONTEXT7_API_KEY="your-key-here"
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search for libraries")
    search_parser.add_argument("query", help="Search query")
    
    # Context command
    context_parser = subparsers.add_parser("context", help="Fetch documentation context")
    context_parser.add_argument("library_id", help="Library ID (e.g., /vercel/next.js)")
    context_parser.add_argument("query", help="Your documentation query")
    context_parser.add_argument("--type", choices=["txt", "md"], default="txt",
                               help="Output format (default: txt)")
    context_parser.add_argument("--tokens", type=int, help="Limit response tokens")
    
    # List command
    subparsers.add_parser("list", help="List popular libraries")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == "search":
        search_libraries(args.query)
    elif args.command == "context":
        get_context(args.library_id, args.query, args.type, args.tokens)
    elif args.command == "list":
        list_libraries()

if __name__ == "__main__":
    main()
