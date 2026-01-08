#!/bin/bash

set -euo pipefail

NODE_VERSION=""
TEST_SUITE=""

while [[ $# -gt 0 ]]; do
    case ${1} in
        --node-version)
            # shellcheck disable=SC2034
            NODE_VERSION="${2}"
            shift # past argument
            shift # past value
            ;;
        --test-suite)
            # shellcheck disable=SC2034
            TEST_SUITE="${2}"
            shift # past argument
            shift # past value
            ;;
        --*)
            echo "Unknown option ${1}"
            exit 1
            ;;
    esac
done

for cmd in npm tsc; do
    if ! command -v "$cmd" &>/dev/null; then
        scripts/setup-code.sh --node-version "${NODE_VERSION}"
        break
    fi
done
set +e
case "${TEST_SUITE}" in
    unit)
        npm run test-unit
        ;;
    integration)
        npm run test-integration; p_stat=$?
        source scripts/utils.sh; set-test-status $TEST_SUITE ${p_stat}
        ;;
    regression)
        npm run test-regression; p_stat=$?
        source scripts/utils.sh; set-test-status $TEST_SUITE ${p_stat}
        ;;
    examples)
        npm run test-examples; p_stat=$?
        source scripts/utils.sh; set-test-status $TEST_SUITE ${p_stat}
        ;;
    --*)
        echo "Unknown test suite (--test-suite) value: ${TEST_SUITE}, should be one of: [unit, integration, regression, examples]"
        exit 1
        ;;
esac
set -e

npm run check-packages
