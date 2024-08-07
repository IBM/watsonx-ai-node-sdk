#!/bin/bash

set -xe

SCRIPTS_DIR="$(dirname "$0")"

# Switch branches
GITHUB_URL=$(git config --get remote.origin.url | sed 's|https://||g' | sed 's|.git||g')
git remote set-url origin "https://${GH_USER}:${GH_TOKEN}@${GITHUB_URL}.git"
git stash
git fetch

# Prepare NPM registry config
"${SCRIPTS_DIR}/prepare-npm-config.sh"

# Publish SDK
git checkout "${TAG}"

set +x
export $(grep -v '^#' npm-config.env | xargs)
set -x

npm audit --audit-level high

if [[ "$(jq -r '.version' package.json)" != "${TAG}" ]] ; then
    echo "Error: Tag that is set in 'package.json' file is different than the git tag. Please update your package with proper tags..."
    exit 1
fi 

if [[ "${NPM_REGISTRY}" != $(npm config get registry) ]] ; then
    npm publish --registry "${NPM_REGISTRY}"
else
    npm publish
fi
