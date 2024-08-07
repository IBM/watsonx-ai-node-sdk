#!/bin/bash

set -e

# Create documentation
printf ">>>>> Generate new documentation\n"
npm run typedoc

# Customize documentation
echo "Do nothing!"
