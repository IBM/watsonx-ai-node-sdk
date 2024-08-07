#!/bin/bash

GENERATOR_VERSION="$(echo "$1" | sed 's/v//g')"

if [[ -z "$GENERATOR_VERSION" ]] ; then
    GENERATOR_VERSION="3.90.0"
fi

GENERATOR_URL=$(curl -Ls \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GH_TOKEN" \
  "https://github.ibm.com/api/v3/repos/CloudEngineering/openapi-sdkgen/releases/tags/$GENERATOR_VERSION" \
  | jq -r '.assets[] | select(.name | endswith(".tar.gz")) | .url')

curl -Ls \
  -H "Accept: application/octet-stream" \
  -H "Authorization: Bearer $GH_TOKEN" \
  "$GENERATOR_URL" \
  -o openapi-sdkgen.tar.gz
tar -xzf openapi-sdkgen.tar.gz
rm -f openapi-sdkgen.tar.gz

echo "Successfully installed openapi-sdkgen $(./openapi-sdkgen/openapi-sdkgen.sh version)"
