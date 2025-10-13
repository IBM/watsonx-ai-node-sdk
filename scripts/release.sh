#!/bin/bash

set -euo pipefail

TAG="$(jq -r '.version' package.json)"
RELEASE_PAYLOAD="$(cat <<EOF
{
    "tag_name": "${TAG}",
    "target_commitish": "main",
    "name": "${TAG}",
    "generate_release_notes": true
}
EOF
)"

# GitHub Enterprise
GHE_TOKEN="$(get_env git-token)"
GHE_URL="$(get_env git-url | sed 's|https://||g' | sed 's|.git||g')"
GHE_REPO="${GHE_URL#*/}"

curl -Ls \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${GHE_TOKEN}" \
    "https://github.ibm.com/api/v3/repos/${GHE_REPO}/releases" \
    -d "${RELEASE_PAYLOAD}"

# GitHub
GH_TOKEN="$(get_env public-git-token)"
GH_URL="$(get_env public-git-url | sed 's|https://||g' | sed 's|.git||g')"
GH_REPO="${GH_URL#*/}"

curl -Ls \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${GH_TOKEN}" \
    "https://api.github.com/repos/${GH_REPO}/releases" \
    -d "${RELEASE_PAYLOAD}"

# Publish SDK to npm registry
git checkout "${TAG}"

set +x
# shellcheck disable=SC2046
export $(grep -v '^#' npm-config.env | xargs)
set -x

npm ci
npm audit --audit-level high

NPM_REGISTRY="$(get_env npm-registry)"

npm run build

if [[ "${NPM_REGISTRY}" != $(npm config get registry) ]] ; then
    (cd dist/ && npm publish --registry "${NPM_REGISTRY}")
else
    (cd dist/ && npm publish)
fi
