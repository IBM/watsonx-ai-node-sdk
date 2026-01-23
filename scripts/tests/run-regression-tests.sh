#!/bin/bash

# This script runs all regression test stages and tracks failures
# It ensures all stages run even if earlier ones fail, but reports the correct exit status

EXIT_CODE=0

echo "=== Stage 1: Running check-langchain-regression.sh ==="
./scripts/tests/check-langchain-regression.sh
if [ $? -ne 0 ]; then
    echo "ERROR: check-langchain-regression.sh failed"
    EXIT_CODE=1
fi

echo ""
echo "=== Stage 2: Running local-publish ==="
npm run local-publish
if [ $? -ne 0 ]; then
    echo "ERROR: local-publish failed"
    EXIT_CODE=1
fi

echo ""
echo "=== Stage 3: Running test-regression in test/langchain ==="
cd ./test/langchain && npm run test-regression
if [ $? -ne 0 ]; then
    echo "ERROR: test-regression failed"
    EXIT_CODE=1
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "=== All regression test stages passed ==="
else
    echo "=== One or more regression test stages failed ==="
fi

exit $EXIT_CODE

# Made with Bob
