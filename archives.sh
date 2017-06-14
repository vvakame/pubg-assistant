#! /bin/bash -eux

if [ -f PUBG-Assistant.zip ]; then
    rm -rf api-ai-archives
    unzip -d api-ai-archives PUBG-Assistant.zip
else
    cd api-ai-archives
    zip -r ../PUBG-Assistant.zip ./**
fi
