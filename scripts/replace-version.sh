#!/bin/sh
set -e

echo "prepare: actualizando imagen en deployment.yml"

VERSION=$1
BRANCH=$2
FILE=$3

SCRIPT_DIR=$(dirname "$0")
FILE_PATH=$(realpath "$SCRIPT_DIR/../ci/$BRANCH/$FILE")

echo "  branch : $BRANCH"
echo "  version: $VERSION"
echo "  file   : $FILE_PATH"

# Reemplaza la etiqueta de versión en cualquier imagen que contenga 'tekoapp-frontend-web:X.Y.Z'
sed -i -E "s|(image:.*tekoapp-frontend-web):([0-9a-zA-Z._-]+)|\1:${VERSION}|" "$FILE_PATH"

echo "  imagen tekoapp-frontend-web actualizada a :${VERSION} en $BRANCH"
