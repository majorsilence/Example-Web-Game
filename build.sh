#!/usr/bin/env bash
set -e # exit on first error
set -u # exit on using unset variable

rm -rf build
mkdir -p build

cp ./index.html ./build
#cp ./style.css ./build
cp -R ./assets ./build
tsc