#!/bin/bash

set -e +x

CONFIG_FILE_NAME="credentials/watsonx_ai_ml_vml_v1.env"

cp "${CONFIG_FILE_NAME}.template" "${CONFIG_FILE_NAME}"

sed -i "s|<APIKEY>|$(get_env watsonx-ai-api-key)|g" "${CONFIG_FILE_NAME}"
sed -i "s|<PROJECT_ID>|$(get_env watsonx-ai-project-id)|g" "${CONFIG_FILE_NAME}"
sed -i "s|<SERVICE_URL>|$(get_env watsonx-ai-service-url)|g" "${CONFIG_FILE_NAME}"

cat >> "${CONFIG_FILE_NAME}" <<EOF
TRAINING_ASSET_ID=$(get_env training-asset-id)
WATSONX_AI_COS_ID=$(get_env watsonx-ai-cos-id)
WATSONX_AI_PLATFORM_URL=$(get_env watsonx-ai-platform-url)
WATSONX_AI_SPACE_ID=$(get_env watsonx-ai-space-id)
MILVUS_URL=$(get_env milvus-url)
MILVUS_USERNAME=$(get_env milvus-username)
MILVUS_PASSWORD=$(get_env milvus-password)
MILVUS_PREFIX=$(get_env milvus-prefix)
EOF
