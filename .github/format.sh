#!/bin/bash
# e is for exiting the script automatically if a command fails, u is for exiting if a variable is not set
set -eu
shopt -s globstar

# INPUTS
PRETTIER_VERSION="${INPUT_PRETTIER_VERSION:-3.3.3}"
FILES_GLOB="${INPUT_FILES_GLOB:-"**/*.{js,jsx,ts,tsx}"}"
CONFIG_PATH="${INPUT_CONFIG_PATH:-}"

# Step 1: Install Prettier
echo "Installing Prettier version $PRETTIER_VERSION..."
npm install --silent prettier@$PRETTIER_VERSION --no-save

# Add the local node_modules/.bin to PATH
export PATH="$(pwd)/node_modules/.bin:$PATH"

# Step 2: Build Prettier command
PRETTIER_COMMAND="prettier --write $FILES_GLOB"

# Add config path if provided
if [[ -n "$CONFIG_PATH" && -f "$CONFIG_PATH" ]]; then
  PRETTIER_COMMAND="$PRETTIER_COMMAND --config $CONFIG_PATH"
fi

# Step 3: Run Prettier
echo "Running Prettier with command: $PRETTIER_COMMAND"
PRETTIER_RESULT=0

# Execute the Prettier command
$PRETTIER_COMMAND || { PRETTIER_RESULT=$?; echo "Problem running Prettier"; exit 1; }

# Step 4: Check if files were modified
if git status --porcelain | grep -q "^[ M]"; then
  echo "Files were changed by Prettier."
  echo "changed-files=true" >> $GITHUB_OUTPUT
else
  echo "No files were changed."
  echo "changed-files=false" >> $GITHUB_OUTPUT
fi