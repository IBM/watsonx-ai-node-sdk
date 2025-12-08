#!/bin/bash

# Install and build
npm install

npm run build

PACKAGE_PATH=$(cd dist && npm pack | tail -1)
ENV_FILE_PATH=$(realpath ./credentials/watsonx_ai_ml_vml_v1.env)

git clone --branch main --single-branch --depth 100 https://github.com/langchain-ai/langchainjs.git

# Load credentials from env files, this is needed locally to run tests in langchain repository
if [ -f $ENV_FILE_PATH ]; then
  set -a
  source $ENV_FILE_PATH
  set +a
fi

if ! command -v ppm &> /dev/null
then
  wget -qO- https://get.pnpm.io/install.sh | sh -
  source /root/.bashrc
fi

(
    cd langchainjs
    # Find latest release tag for @langchain/community
    LATEST_FULL_TAG=$(git tag --list "*community*" \
        | awk -F'[@=]' '{print $NF " " $0}' \
        | sort -V \
        | tail -n 1 \
        | awk '{print $2}'
    )
    echo Latest release is: "$LATEST_FULL_TAG"
    git checkout $LATEST_FULL_TAG
    git pull
    pnpm install
    cd libs/langchain-core && pnpm install && pnpm build
    cd ../langchain-community && pnpm add ../../../dist/$PACKAGE_PATH
    pnpm install
    pnpm build
    pnpm test:single ibm
)
rm -rf langchainjs
