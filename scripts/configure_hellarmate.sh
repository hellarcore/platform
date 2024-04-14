#!/usr/bin/env bash

set -e

CONFIG_NAME="local"

FULL_PATH=$(realpath "$0")
DIR_PATH=$(dirname "$FULL_PATH")
ROOT_PATH=$(dirname "$DIR_PATH")

# build Drive, HAPI and Hellarmate helper from sources

# TODO: Doesn't work
#yarn hellarmate config set --config=${CONFIG_NAME} docker.baseImage.build.enabled true
#yarn hellarmate config set --config=${CONFIG_NAME} docker.baseImage.build.target deps
yarn hellarmate config set --config=${CONFIG_NAME} platform.drive.abci.docker.build.enabled true
yarn hellarmate config set --config=${CONFIG_NAME} platform.hapi.api.docker.build.enabled true
yarn hellarmate config set --config=${CONFIG_NAME} hellarmate.helper.docker.build.enabled true

# create tenderhellar blocks every 10s to speed up test suite
yarn hellarmate config set --config=${CONFIG_NAME} platform.drive.tenderhellar.consensus.createEmptyBlocksInterval "10s"

# collect drive logs for bench suite
yarn hellarmate config set --config=${CONFIG_NAME} platform.drive.abci.logs.stdout.level "trace"
