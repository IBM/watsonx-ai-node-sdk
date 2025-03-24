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

if ! command -v npm &> /dev/null ; then
    scripts/setup-code.sh --node-version "${NODE_VERSION}"
fi

case "${TEST_SUITE}" in
    unit)
        npm run test-unit
        ;;
    integration)
        npm run test-integration
        ;;
    regression)
        npm run test-regression
        ;;
    examples)
        npm run test-examples
        ;;
    --*)
        echo "Unknown test suite (--test-suite) value: ${TEST_SUITE}, should be one of: [unit, integration, regression, examples]"
        exit 1
        ;;
esac

npm run check-packages
