#!/bin/bash

function setup-git() {
    local PREFIX=""
    if [[ "${1}" == "public" ]] ; then
        PREFIX="public-"
    fi

    local GITHUB_USER
    local GITHUB_EMAIL
    local GITHUB_TOKEN
    local GITHUB_URL

    GITHUB_USER="$(get_env "${PREFIX}git-user")"
    GITHUB_EMAIL="$(get_env "${PREFIX}git-email")"
    GITHUB_TOKEN="$(get_env "${PREFIX}git-token")"
    GITHUB_URL="$(get_env "${PREFIX}git-url" | sed 's|https://||g' | sed 's|.git||g')"

    git config --local user.name "${GITHUB_USER}"
    git config --local user.email "${GITHUB_EMAIL}"
    git remote set-url origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@${GITHUB_URL}.git"
    git stash
    git fetch
}

function set-test-status(){
    local TEST_SUITE
    local TEST_RESULT
    local DESCRIPTION
    declare -A OUTCOME_MAP

    TEST_SUITE=$1
    TEST_RESULT=$2
    OUTCOME_MAP=([0]="success" [1]="failure")
    DESCRIPTION="Test suite ${TEST_SUITE} was a ${OUTCOME_MAP[$TEST_RESULT]}."
    set-commit-status \
      --repository "$(load_repo app-repo url)" \
      --commit-sha "$(load_repo app-repo commit)" \
      --state "${OUTCOME_MAP[$TEST_RESULT]}" \
      --description "${DESCRIPTION}" \
      --context "tekton/code-test-${TEST_SUITE}" \
      --task-name async-stage
    if [[ $TEST_RESULT -ne 0 ]]; then exit 1; fi
}
