#!/bin/bash

set -euo pipefail

source scripts/utils.sh

# Public GitHub
GH_USER="$(get_env "public-git-user")"
GH_TOKEN="$(get_env public-git-token)"
GH_URL="$(get_env public-git-url | sed 's|https://||g' | sed 's|.git||g')"
PUBLIC_REPO_DIR="../public-gh"

git clone "https://${GH_USER}:${GH_TOKEN}@${GH_URL}.git" "${PUBLIC_REPO_DIR}"

# Main branch
# Clear all files in public repo 
cd "${PUBLIC_REPO_DIR}"

setup-git public

git checkout main
TRACKED_FILES_TO_DELETE=$(git ls-files)
echo "${TRACKED_FILES_TO_DELETE}" | xargs rm -f     # Use echo and then rm for easier debugging 
cd -

# Upload files from enterprise repo to the public one
# git checkout main
TRACKED_FILES_TO_UPLOAD=$(git ls-files)
for ITEM in ${TRACKED_FILES_TO_UPLOAD} ; do
    cp -f "${ITEM}" "${PUBLIC_REPO_DIR}/${ITEM}"
done

cd "${PUBLIC_REPO_DIR}"
TAG="$(jq -r '.version' package.json)"

if [[ -z "${TAG}" ]] ; then
    echo "Empty tag name in public GitHub repository. It may occur when there is no package.json file..."
    exit 1
fi

git status
git add --all
git commit -m "release: ${TAG}"
git push -u origin main

# Documentation branch
# Clear all files in public repo
git checkout gh-pages
TRACKED_FILES_TO_DELETE=$(git ls-files)
echo "${TRACKED_FILES_TO_DELETE}" | xargs rm -f     # Use echo and then rm for easier debugging 
cd -

# Upload files from enterprise repo to the public one
git checkout gh-pages
TRACKED_FILES_TO_UPLOAD=$(git ls-files)
for ITEM in ${TRACKED_FILES_TO_UPLOAD} ; do
    cp -f "${ITEM}" "${PUBLIC_REPO_DIR}/${ITEM}"
done

cd "${PUBLIC_REPO_DIR}"
git status
git add --all
git commit -m "release: ${TAG}"
git push -u origin gh-pages

# Create git tag in public GitHub repository
git tag "${TAG}"
git push origin tag "${TAG}"
