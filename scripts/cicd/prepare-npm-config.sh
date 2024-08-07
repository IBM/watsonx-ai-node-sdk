#!/bin/bash

set -e +x

CONFIG_FILE_NAME="npm-config.env"

cp $CONFIG_FILE_NAME.template $CONFIG_FILE_NAME
sed -i "s|<NPM_REGISTRY>|\'$NPM_REGISTRY\'|g" $CONFIG_FILE_NAME
sed -i "s|<NPM_AUTH_TOKEN>|\'$NPM_AUTH_TOKEN\'|g" $CONFIG_FILE_NAME
