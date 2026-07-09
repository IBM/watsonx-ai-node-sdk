
#!/bin/bash

# This script runs all regression test stages and tracks failures
# It ensures all stages run even if earlier ones fail, but reports the correct exit status

EXIT_CODE=0

ensure_yalc() {
    # If Jenkins sets NPM_CONFIG_PREFIX, make sure its bin directory is visible.
    if [ -n "${NPM_CONFIG_PREFIX:-}" ]; then
        export PATH="$NPM_CONFIG_PREFIX/bin:$PATH"
    fi

    # If npm uses lowercase config env, support it too.
    if [ -n "${npm_config_prefix:-}" ]; then
        export PATH="$npm_config_prefix/bin:$PATH"
    fi
    
    # Also include current global npm bin path.
    export PATH="$(npm prefix -g)/bin:$PATH"

    if ! command -v yalc >/dev/null 2>&1; then
        echo "yalc not found, installing..."
        npm install -g yalc
        export PATH="$(npm prefix -g)/bin:$PATH"
    fi

    echo "Using yalc from: $(command -v yalc)"
    yalc --version
}

echo "=== Stage 1: Running check-langchain-regression.sh ==="
./scripts/tests/check-langchain-regression.sh
if [ $? -ne 0 ]; then
    echo "ERROR: check-langchain-regression.sh failed"
    EXIT_CODE=1
fi

echo ""
echo "=== Stage 2: Running local-publish ==="
ensure_yalc
npm run local-publish
if [ $? -ne 0 ]; then
    echo "ERROR: local-publish failed"
    EXIT_CODE=1
fi

echo ""
echo "=== Stage 3: Running test-regression in test/langchain ==="
ensure_yalc
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
