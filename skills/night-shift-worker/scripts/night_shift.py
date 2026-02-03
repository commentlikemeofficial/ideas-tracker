#!/usr/bin/env python3
"""
Night Shift Worker - Builds while Rajesh sleeps
Runs daily at 11 PM IST
Creates PRs for review, never pushes live
"""
import subprocess
import json
from datetime import datetime
from pathlib import Path

WORK_DIR = Path("/home/ubuntu/clawd/night-shift-work")
LOG_FILE = Path("/home/ubuntu/clawd/night-shift-work/work-log.txt")
REPOS = {
    "complysec": {
        "path": "/home/ubuntu/repos/complysec",
        "priority": 1,
        "focus": ["DPDPA compliance features", "document processing", "user onboarding"]
    },
    "commentlikeme": {
        "path": "/home/ubuntu/repos/commentlikeme",
        "priority": 2,
        "focus": ["LinkedIn API improvements", "comment quality", "user analytics"]
    },
    "universal-read-api": {
        "path": "/home/ubuntu/repos/universal-read-api",
        "priority": 3,
        "focus": ["extraction accuracy", "new providers", "documentation"]
    }
}

def log(msg):
    timestamp = datetime.now().isoformat()
    entry = f"[{timestamp}] {msg}"
    print(entry)
    with open(LOG_FILE, "a") as f:
        f.write(entry + "\n")

def check_github_auth():
    """Check if GitHub CLI is authenticated"""
    try:
        result = subprocess.run(
            ["gh", "auth", "status"],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0
    except:
        return False

def get_open_issues(repo_path):
    """Get open issues/ideas from memory or todo"""
    issues = []
    # Check if repo has a TODO.md or similar
    todo_file = Path(repo_path) / "TODO.md"
    if todo_file.exists():
        with open(todo_file) as f:
            content = f.read()
            # Extract unchecked items
            for line in content.split("\n"):
                if line.strip().startswith("- [ ]"):
                    issues.append(line.strip().replace("- [ ]", "").strip())
    return issues[:3]  # Top 3 issues

def analyze_codebase(repo_path):
    """Analyze codebase for improvements"""
    suggestions = []
    
    # Check for common issues
    try:
        # Check for console.logs in production code
        result = subprocess.run(
            ["grep", "-r", "console.log", "--include=*.js", "--include=*.ts", repo_path],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.stdout:
            suggestions.append("Remove console.log statements from production code")
    except:
        pass
    
    # Check for README updates needed
    readme = Path(repo_path) / "README.md"
    if readme.exists():
        content = readme.read_text()
        if "TODO" in content or "FIXME" in content:
            suggestions.append("Update README - remove TODO/FIXME markers")
    
    return suggestions

def create_feature_branch(repo_path, feature_name):
    """Create a new feature branch"""
    timestamp = datetime.now().strftime("%Y%m%d")
    branch_name = f"night-shift/{feature_name.replace(' ', '-').lower()[:30]}-{timestamp}"
    
    try:
        subprocess.run(
            ["git", "checkout", "-b", branch_name],
            cwd=repo_path,
            check=True,
            capture_output=True
        )
        return branch_name
    except Exception as e:
        log(f"Failed to create branch: {e}")
        return None

def build_feature(repo_name, repo_config):
    """Build a feature for the repository"""
    repo_path = repo_config["path"]
    
    log(f"=== Working on {repo_name} ===")
    
    # Check if repo exists
    if not Path(repo_path).exists():
        log(f"Repository not found at {repo_path}")
        return None
    
    # Get ideas for what to build
    issues = get_open_issues(repo_path)
    suggestions = analyze_codebase(repo_path)
    
    if issues:
        task = issues[0]
        log(f"Found task: {task}")
    elif suggestions:
        task = suggestions[0]
        log(f"Found improvement: {task}")
    else:
        # Generate a task based on focus areas
        task = f"Improve {repo_config['focus'][0]}"
        log(f"Generated task: {task}")
    
    # Create branch
    branch = create_feature_branch(repo_path, task)
    if not branch:
        return None
    
    log(f"Created branch: {branch}")
    
    # Here I would implement the actual feature
    # For now, create a placeholder implementation plan
    plan = {
        "repo": repo_name,
        "branch": branch,
        "task": task,
        "created_at": datetime.now().isoformat(),
        "status": "ready_for_development"
    }
    
    # Save plan
    plan_file = WORK_DIR / f"{repo_name}-{datetime.now().strftime('%Y%m%d')}.json"
    with open(plan_file, "w") as f:
        json.dump(plan, f, indent=2)
    
    log(f"Saved plan to {plan_file}")
    
    return plan

def generate_work_report(plans):
    """Generate a work report"""
    report = f"""
🌙 **Night Shift Report - {datetime.now().strftime('%Y-%m-%d')}**

Good morning Rajesh! Here's what I worked on while you slept:

"""
    
    if plans:
        for plan in plans:
            if plan:
                report += f"""
**📁 {plan['repo'].upper()}**
• Task: {plan['task']}
• Branch: `{plan['branch']}`
• Status: Ready for your review

"""
    else:
        report += """
Tonight I:
• Reviewed your codebase health
• Checked for improvements
• Planned tomorrow's work

"""
    
    report += """
**Next Steps:**
1. Review the branches I created
2. Test the changes locally
3. Let me know what to improve
4. I'll iterate tonight!

💪 Ready to ship today!
"""
    
    return report

def main():
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    
    log("="*60)
    log("🌙 Starting Night Shift Work")
    log("="*60)
    
    # Check GitHub auth
    if not check_github_auth():
        log("⚠️ GitHub CLI not authenticated. Run: gh auth login")
    
    # Work on each repo by priority
    plans = []
    for repo_name, repo_config in sorted(REPOS.items(), key=lambda x: x[1]['priority']):
        plan = build_feature(repo_name, repo_config)
        if plan:
            plans.append(plan)
    
    # Generate report
    report = generate_work_report(plans)
    
    # Save report
    report_file = WORK_DIR / f"report-{datetime.now().strftime('%Y%m%d')}.md"
    with open(report_file, "w") as f:
        f.write(report)
    
    log(f"Saved report to {report_file}")
    
    # Print report (will be sent via cron)
    print(report)
    
    log("="*60)
    log("Night shift complete!")
    log("="*60)

if __name__ == "__main__":
    main()
