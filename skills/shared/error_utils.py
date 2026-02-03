#!/usr/bin/env python3
"""
Shared error handling utilities for clawd skill scripts
Provides consistent error handling patterns across all skills
"""

import sys
import json
from pathlib import Path
from functools import wraps


def safe_exit(code=0, message=None):
    """
    Safely exit with a message.
    
    Args:
        code: Exit code (0 for success, 1 for error)
        message: Optional message to print before exiting
    """
    if message:
        if code == 0:
            print(message)
        else:
            print(f"Error: {message}", file=sys.stderr)
    sys.exit(code)


def handle_missing_file(filepath, create_default=None):
    """
    Handle missing file gracefully.
    
    Args:
        filepath: Path to check
        create_default: Optional default content to create file with
    
    Returns:
        True if file exists or was created, False otherwise
    """
    path = Path(filepath)
    if path.exists():
        return True
    
    if create_default is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            if isinstance(create_default, dict):
                json.dump(create_default, f, indent=2)
            else:
                f.write(str(create_default))
        return True
    
    return False


def load_json_safe(filepath, default=None):
    """
    Safely load JSON file with fallback.
    
    Args:
        filepath: Path to JSON file
        default: Default value if file doesn't exist or is invalid
    
    Returns:
        Parsed JSON or default value
    """
    default = default if default is not None else {}
    path = Path(filepath)
    
    if not path.exists():
        return default
    
    try:
        with open(path) as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return default


def save_json_safe(filepath, data):
    """
    Safely save JSON file with directory creation.
    
    Args:
        filepath: Path to save to
        data: Data to save
    
    Returns:
        True if saved successfully, False otherwise
    """
    try:
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except (IOError, OSError):
        return False


def require_args(min_args, usage_msg):
    """
    Decorator to require minimum arguments.
    
    Args:
        min_args: Minimum number of arguments required
        usage_msg: Usage message to display if not enough args
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if len(sys.argv) < min_args:
                print(usage_msg)
                sys.exit(1)
            return func(*args, **kwargs)
        return wrapper
    return decorator


def validate_env_var(var_name, required=True):
    """
    Validate that an environment variable exists.
    
    Args:
        var_name: Name of environment variable
        required: Whether the variable is required
    
    Returns:
        Value of environment variable or None
    """
    import os
    value = os.environ.get(var_name)
    if required and not value:
        print(f"Error: {var_name} environment variable is required", file=sys.stderr)
        sys.exit(1)
    return value


def with_error_handling(default_return=None):
    """
    Decorator to wrap functions with error handling.
    
    Args:
        default_return: Value to return on error
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"Error in {func.__name__}: {e}", file=sys.stderr)
                return default_return
        return wrapper
    return decorator


class SkillError(Exception):
    """Base exception for skill scripts."""
    pass


class ValidationError(SkillError):
    """Raised when input validation fails."""
    pass


class DataError(SkillError):
    """Raised when data operations fail."""
    pass


# Example usage patterns as comments:
"""
# Pattern 1: Safe JSON operations
from error_utils import load_json_safe, save_json_safe

data = load_json_safe("/path/to/data.json", default={"items": []})
data["items"].append(new_item)
save_json_safe("/path/to/data.json", data)

# Pattern 2: Safe exit with message
from error_utils import safe_exit

if not data:
    safe_exit(0)  # Empty data is not an error

# Pattern 3: Validate environment variables
from error_utils import validate_env_var

api_key = validate_env_var("API_KEY", required=True)

# Pattern 4: Decorator for error handling
from error_utils import with_error_handling

@with_error_handling(default_return=[])
def fetch_data():
    # risky operation
    return results
"""
