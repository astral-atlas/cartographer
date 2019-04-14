#!/usr/bin/env bash
mkdir -p docker-temp

cp package.json docker-temp/package.json
cp package-lock.json docker-temp/package-lock.json
cp dockerfile docker-temp/dockerfile
cp -r dist docker-temp/dist