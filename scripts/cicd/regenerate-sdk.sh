#!/bin/bash

set -xe

SCRIPTS_DIR="$(dirname "$0")"
REGENERATION_TIMESTAMP="$(date +%F_%H-%M-%S)"

# Check if prerequisites are present
source "${SCRIPTS_DIR}/prepare-env.sh"

# Download API specification file
API_SPEC_FILE="watsonx-ai.json"

if [[ ! "${API_SPEC_FROM_PARAMETER}" =~ (1|y|yes|t|true|on|run) ]] ; then
    curl -Ls \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer ${GH_TOKEN}" \
      "https://raw.github.ibm.com/cloud-api-docs/machine-learning/master/watsonx-ai.json" \
      -o "${API_SPEC_FILE}"
fi

# Validate API specification if needed
if [[ "${VALIDATE_API_SPEC}" =~ (1|y|yes|t|true|on|run) ]] ; then
    if ! command -v lint-openapi &> /dev/null ; then
        echo "IBM-openapi-validator could not be found. Will install it now..."
        npm install -g ibm-openapi-validator
        echo "Successfully installed IBM-openapi-validator $(lint-openapi --version)"
    fi
    lint-openapi -s "${API_SPEC_FILE}" || echo "Some errors occured while validationg API specification file..."
fi

# Switch branches
GITHUB_URL=$(git config --get remote.origin.url | sed 's|https://||g' | sed 's|.git||g')
git config --local user.name "${GH_USER}"
git config --local user.email "${GH_EMAIL}"
git remote set-url origin "https://${GH_USER}:${GH_TOKEN}@${GITHUB_URL}.git"
git stash
git fetch

NEW_BRANCH_NAME="sdk_regeneration_${REGENERATION_TIMESTAMP}"
git checkout -b "${NEW_BRANCH_NAME}"
git push --set-upstream origin "${NEW_BRANCH_NAME}"

# Regenerate SDK
GENERATOR_DIR="./openapi-sdkgen"
"${GENERATOR_DIR}/openapi-sdkgen.sh" generate -g ibm-node -i "${API_SPEC_FILE}" -o . --genITs

# Test new code
npm run test-unit || echo "Unit tests have failed..."

# Apply eslint
npm run lint-fix

# Compare newly generated SDK code
git status
git diff

# Push to the remote repository
GENERATOR_VERSION=$("${GENERATOR_DIR}/openapi-sdkgen.sh" version)
GENERATOR_VERSION=${GENERATOR_VERSION%%-*}
git add --all
git commit -m "Code regenerated at ${REGENERATION_TIMESTAMP} - build_${BUILD_NUMBER}"
git push

# Create a draft Pull Request to the base branch
GITHUB_REPO="${GITHUB_URL#*/}"
PR_TITLE="[Pipeline] Code update - build_${BUILD_NUMBER}"
PR_BODY="**This Pull Request is created by automation pipeline.**\n\nRegenerated SDK code with openapi-sdkgen:${GENERATOR_VERSION}.\nSource API specification can be downloaded from [build URL](${BUILD_URL})\n"
curl -Ls \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  "https://github.ibm.com/api/v3/repos/${GITHUB_REPO}/pulls" \
  -d "{\"title\": \"${PR_TITLE}\", \"body\": \"${PR_BODY}\", \"head\": \"${NEW_BRANCH_NAME}\", \"base\": \"${BRANCH_NAME}\", \"draft\": true}"
