#!/bin/bash
if [ -f .env ]; then
    echo '****************************************'
    echo '***        Backing Up .env           ***'
    echo '****************************************'

    mv .env .env.temp
    MOVED_ENV=true
fi

echo '****************************************'
echo '***        Production .env           ***'
echo '****************************************'
cp .env.production .env

echo '****************************************'
echo '***         Deploying App            ***'
echo '****************************************'
gcloud app deploy

if [ "$MOVED_ENV" = true ]; then
    echo '****************************************'
    echo '***        Restoring .env            ***'
    echo '****************************************'

    mv .env.temp .env
fi
