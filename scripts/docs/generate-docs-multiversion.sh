#!/bin/bash

set -xe
GENERATION_TIMESTAMP="$(date +%F_%H-%M-%S)"

# Set up git origin URL
GITHUB_URL=$(git config --get remote.origin.url | sed 's|https://||g' | sed 's|.git||g')
git remote set-url origin "https://${GH_USER}:${GH_TOKEN}@${GITHUB_URL}.git"
git stash
git fetch

# Generate docs JSON file for each SDK version
TAGS=$(git tag -l)
DOC_FILES=()

for TAG in ${TAGS} ; do
    git checkout "${TAG}"
    npm run typedoc -- --json "${TAG}.json" --name "${TAG}"
    DOC_FILES+=("${TAG}.json")
done

# Merge docs and generate HTML files
git checkout main
npm run typedoc-merge -- "${DOC_FILES[@]}"

# Replace documentation in GitHub
DOCS_DIR=$(jq -r '.out' typedoc.json)
git checkout gh-pages

TRACKED_FILES=$(git ls-files | grep -v gitignore)
echo "${TRACKED_FILES}" | xargs rm -f
rm -f "${DOC_FILES[@]}"
cp -r "${DOCS_DIR}"/. .
rm -rf "${DOCS_DIR}"

git status
git add --all
git commit -m "Documentation generated at ${GENERATION_TIMESTAMP} - build_${BUILD_NUMBER}"
git push
