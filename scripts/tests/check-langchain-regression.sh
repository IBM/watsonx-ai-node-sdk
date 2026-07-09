#!/bin/bash

# Store the workspace directory before entering subshell
WORKSPACE_DIR=$(pwd)
# Install and build
export NVM_DIR="$HOME/.nvm"
    # Check if nvm is already installed
    if [ -s "$NVM_DIR/nvm.sh" ]; then
      echo "nvm found, sourcing it"
      source "$NVM_DIR/nvm.sh"
    else
      echo "nvm not available, installing it with Node.js"
      bash "${WORKSPACE_DIR}/scripts/install-node.sh" 20 

      # Verify nvm was installed
      if [ ! -s "$NVM_DIR/nvm.sh" ]; then
        echo "ERROR: Failed to install nvm"
         exit 1
      fi

      source "$NVM_DIR/nvm.sh"
    fi

npm install

npm run build

PACKAGE_PATH=$(cd dist && npm pack | tail -1)

git clone --branch main --single-branch --depth 100 https://github.com/langchain-ai/langchainjs.git


(
    cd langchainjs
    # Find latest release tag for @langchain/ibm
    LATEST_FULL_TAG=$(git tag --list "*ibm*" \
        | awk -F'[@=]' '{print $NF " " $0}' \
        | sort -V \
        | tail -n 1 \
        | awk '{print $2}'
    )
    echo "Latest release is: $LATEST_FULL_TAG"
    git checkout "$LATEST_FULL_TAG"
    
    unset npm_config_prefix && unset NPM_CONFIG_PREFIX # unseting this parameter since it breakes nvm but is not used in this job
    
    echo "Installing Node.js"
    nvm install
    nvm use
    
    npm install -g pnpm
    export PATH="$(npm prefix -g)/bin:$PATH"
    
    # Verify pnpm is available
    if ! command -v pnpm &> /dev/null; then
      echo "ERROR: pnpm not found after installation"
      exit 1
    fi
    
    echo "pnpm version: $(pnpm --version)"

    pnpm install && pnpm build --filter @langchain/core
    # Change to the IBM provider directory
    cd libs/providers/langchain-ibm

    # Add the local package
    pnpm add "../../../../dist/$PACKAGE_PATH"

    BUILD_OUTPUT=$(pnpm build 2>&1)
    BUILD_EXIT=$?
    
    # If build failed, check if it's only due to publint file: reference
    if [ $BUILD_EXIT -ne 0 ]; then
        if echo "$BUILD_OUTPUT" | grep -q "publint.*file:"; then
            echo "Build completed with publint warning about file: dependency (expected, ignoring)"
        else
            # Real build error, show output and fail
            echo "$BUILD_OUTPUT"
            exit $BUILD_EXIT
        fi
    fi

    # Build only @langchain/ibm
    pnpm build

    pnpm test
    
)
SUBSHELL_EXIT=$?
rm -rf langchainjs
exit $SUBSHELL_EXIT
