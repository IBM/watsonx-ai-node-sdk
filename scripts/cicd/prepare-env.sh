#!/bin/bash

SCRIPTS_DIR="$(dirname "$0")"
source "${SCRIPTS_DIR}/common.sh"

if [[ -z "$JAVA_HOME" ]] ; then
    echo "JAVA_HOME environment variable could not be found..."
    exit 1
else
    export PATH=$JAVA_HOME/bin:$PATH
fi

if command -v node &> /dev/null ; then
    CURRENT_NODE_VERSION=$(node -v | sed 's/v//g')
    LAST_SUPPORTED_VERISON="14"

    result=$(version_comparison "$CURRENT_NODE_VERSION" "$LAST_SUPPORTED_VERISON")

    if [[ "$result" == "<" ]] ; then
        echo "Your node version is too old. Will update your node installation..."
        source "${SCRIPTS_DIR}/install-node.sh"
    fi
else
    echo "Command node not found. Will install Node.js..."
    source "${SCRIPTS_DIR}/install-node.sh"
fi

npm install

"${SCRIPTS_DIR}/install-generator.sh" "$GENERATOR_VERSION"
