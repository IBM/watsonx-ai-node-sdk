#!/bin/bash

set -e +x

CONFIG_FILE_NAME="test/integration/watsonx_ai_ml_vml_v1.env"

cp $CONFIG_FILE_NAME.template $CONFIG_FILE_NAME
sed -i "s|<APIKEY>|\'$WATSONX_AI_APIKEY\'|g" $CONFIG_FILE_NAME
sed -i "s|<PROJECT_ID>|\'$WATSONX_AI_PROJECT_ID\'|g" $CONFIG_FILE_NAME
sed -i "s|<SERVICE_URL>|\'$WATSONX_AI_SERVICE_URL\'|g" $CONFIG_FILE_NAME
echo '' >> $CONFIG_FILE_NAME
echo "TRAINING_ASSET_ID='$TRAINING_ASSET_ID'" >> $CONFIG_FILE_NAME
echo '' >> $CONFIG_FILE_NAME
echo "WATSONX_AI_PLATFORM_URL='$WATSONX_AI_PLATFORM_URL'" >> $CONFIG_FILE_NAME
