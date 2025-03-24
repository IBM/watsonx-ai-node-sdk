#!/bin/bash

set -e +x

CONFIG_FILE_NAME="npm-config.env"

cp $CONFIG_FILE_NAME.template $CONFIG_FILE_NAME
sed -i "s|<NPM_REGISTRY>|$(get_env npm-registry)|g" $CONFIG_FILE_NAME
sed -i "s|<NPM_AUTH_TOKEN>|$(get_env npm-token)|g" $CONFIG_FILE_NAME
