#!/usr/bin/env python3
"""
Safe npm install wrapper with aggressive timeout handling
Kills entire process tree, not just parent
"""
import subprocess
import sys
import os
import signal
import time
from pathlib import Path

def kill_process_tree(pid):
    """Kill a process and all its children recursively"""
    try:
        # Get all child processes
        result = subprocess.run(
            ['pgrep', '-P', str(pid)],
            capture_output=True, text=True, timeout=5
        )
        children = result.stdout.strip().split('\n') if result.stdout.strip() else []
        
        # Kill children first
        for child_pid in children:
            if child_pid:
                try:
                    os.kill(int(child_pid), signal.SIGKILL)
                except ProcessLookupError:
                    pass
        
        # Kill parent
        try:
            os.kill(pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
            
    except Exception:
        pass

def safe_npm_install(timeout_sec=60, cwd=None):
    """
    Run npm install with guaranteed timeout
    
    Args:
        timeout_sec: Max seconds to wait (default 60)
        cwd: Working directory for install
    
    Returns:
        dict: {ok: bool, stdout: str, stderr: str, error: str|None}
    """
    env = {
        **os.environ,
        'NPM_CONFIG_FUND': 'false',
        'npm_config_fund': 'false',
        'NPM_CONFIG_AUDIT': 'false',
        'npm_config_loglevel': 'error'
    }
    
    print(f"📦 Running npm install (timeout: {timeout_sec}s)...", file=sys.stderr)
    
    process = subprocess.Popen(
        ['npm', 'install', '--no-fund', '--no-audit'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=cwd,
        env=env,
        preexec_fn=os.setsid if hasattr(os, 'setsid') else None
    )
    
    try:
        stdout, stderr = process.communicate(timeout=timeout_sec)
        
        if process.returncode == 0:
            print("✅ npm install completed", file=sys.stderr)
            return {
                'ok': True,
                'stdout': stdout.decode('utf-8', errors='replace'),
                'stderr': stderr.decode('utf-8', errors='replace'),
                'error': None
            }
        else:
            return {
                'ok': False,
                'stdout': stdout.decode('utf-8', errors='replace'),
                'stderr': stderr.decode('utf-8', errors='replace'),
                'error': f'npm install exited with code {process.returncode}'
            }
            
    except subprocess.TimeoutExpired:
        print(f"⏱️ npm install timed out after {timeout_sec}s, killing process tree...", file=sys.stderr)
        
        # Kill entire process group
        if hasattr(os, 'killpg'):
            try:
                os.killpg(os.getpgid(process.pid), signal.SIGKILL)
            except ProcessLookupError:
                pass
        else:
            kill_process_tree(process.pid)
        
        process.wait()
        
        return {
            'ok': False,
            'stdout': '',
            'stderr': '',
            'error': f'npm install timed out after {timeout_sec} seconds'
        }
    
    except Exception as e:
        try:
            process.kill()
        except:
            pass
        return {
            'ok': False,
            'stdout': '',
            'stderr': '',
            'error': f'npm install failed: {str(e)}'
        }

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Safe npm install with timeout')
    parser.add_argument('--timeout', type=int, default=60, help='Timeout in seconds')
    parser.add_argument('--cwd', type=str, default=None, help='Working directory')
    args = parser.parse_args()
    
    result = safe_npm_install(timeout_sec=args.timeout, cwd=args.cwd)
    
    if result['stdout']:
        print(result['stdout'])
    if result['stderr']:
        print(result['stderr'], file=sys.stderr)
    
    if not result['ok']:
        print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(1)
