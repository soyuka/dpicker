#!/bin/bash
git checkout gh-pages
git reset --hard origin/master
bash .scripts/build-docs.sh
mv docs/* .
git add -f _api.md
git add -f demo/public/dist
git add -f .
git commit -m 'bump doc'
git push -fu origin gh-pages
git checkout master
