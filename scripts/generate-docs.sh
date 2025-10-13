#!/bin/bash

set -euo pipefail

source scripts/utils.sh

GENERATION_TIMESTAMP="$(date +%F_%H-%M-%S)"

setup-git enterprise

# Select only the most recent tag for each pair MAJOR-MINOR number
TAGS=$(git tag -l)
SELECTED_TAGS=$(for TAG in ${TAGS}; do
    VER=${TAG%.*}
    echo "${TAG%%.*}${VER#*.} ${TAG##*.} ${TAG}"
done | sort -nrk2 | awk '!x[$1]++' | sort -nk1 | awk '{print $3}')
echo "${SELECTED_TAGS[@]}"

# Generate docs JSON file for each selected SDK version
TREE_CHANGE_VERSION=1.7.0
DOC_FILES=()
for TAG in ${SELECTED_TAGS} ; do
    git checkout "${TAG}"
    if [[ "$(printf '%s\n%s' "$TREE_CHANGE_VERSION" "$TAG" | sort -V | head -n1)" == "$TREE_CHANGE_VERSION" ]]; then
        npm run typedoc src/ -- --json "${TAG%.*}.json" --name "${TAG%.*}.x"
    else
        npm run typedoc -- --json "${TAG%.*}.json" --name "${TAG%.*}.x"
    fi
    DOC_FILES+=("${TAG%.*}.json")
done

# Merge docs and generate HTML files
git checkout main
npm run typedoc-merge -- "${DOC_FILES[@]}"

# Replace documentation in GitHub
DOCS_DIR="$(jq -r '.out' typedoc.json)"
git checkout gh-pages

TRACKED_FILES=$(git ls-files | grep -v gitignore)
echo "${TRACKED_FILES}" | xargs rm -f
rm -f "${DOC_FILES[@]}"
cp -r "${DOCS_DIR}"/. .
rm -rf "${DOCS_DIR}"

git status
git add --all
git commit -m "Documentation generated at ${GENERATION_TIMESTAMP}" || \
    echo "There was some issuie when commiting changes. Skipping..."
git push
