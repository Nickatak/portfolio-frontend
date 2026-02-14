#!/bin/bash

# Toggle environment symlink script
# Usage: ./toggle-env.sh [dev|prod]

if [ $# -eq 0 ]; then
    echo "Usage: $0 [dev|prod]"
    echo ""
    echo "Creates a symlink from .env to .env.dev or .env.prod"
    echo ""
    echo "Examples:"
    echo "  $0 dev      - Sets environment to development"
    echo "  $0 prod     - Sets environment to production"
    exit 1
fi

ENV=$1

# Validate argument
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
    echo "Error: Environment must be either 'dev' or 'prod'"
    exit 1
fi

ENV_FILE=".env.${ENV}"

# Check if the env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist"
    exit 1
fi

# Remove existing .env symlink if it exists
if [ -L ".env" ] || [ -f ".env" ]; then
    rm ".env"
    echo "Removed existing .env"
fi

# Create new symlink
ln -s "$ENV_FILE" ".env"
echo "✓ Created symlink: .env → $ENV_FILE"
