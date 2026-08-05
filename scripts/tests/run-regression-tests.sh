
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
# Stage 1 switched nvm to Node v24 (pinned by langchainjs/.nvmrc since @langchain/ibm@0.2.0).
# @swc/core in test/langchain has no prebuilt binary for Node 24 and crashes at
# runtime, so switch back to v20. NPM_CONFIG_PREFIX must be unset first — nvm
# refuses to switch while that Jenkins variable is set.
unset NPM_CONFIG_PREFIX npm_config_prefix
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" && nvm use 20
# Wipe node_modules so npm does a fully clean install and re-downloads the
# @swc/core optional platform binary for Node 20. Deleting package-lock.json
# too so npm does not skip optional deps it considers already satisfied.
rm -rf ./test/langchain/node_modules ./test/langchain/package-lock.json
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
