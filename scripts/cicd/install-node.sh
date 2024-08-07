#!/bin/bash

NODE_VERSION="$(echo "$1" | sed 's/v//g')"

if [[ -z "$NODE_VERSION" ]] ; then
    NODE_VERSION="20"
fi

export NVM_DIR="$HOME/.nvm"

if ! [[ -s "$NVM_DIR/nvm.sh" ]] ; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" &> /dev/null

nvm install v"$NODE_VERSION"

echo "Successfully installed Node.js $(node -v)"
