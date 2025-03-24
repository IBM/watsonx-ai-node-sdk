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
