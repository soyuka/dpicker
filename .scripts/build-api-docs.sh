#!/bin/bash
git checkout gh-pages
git reset --hard origin/master
bower install
gulp build-styles
npm run coverage
./node_modules/.bin/jsdoc -c jsdoc.conf.json -R README.md -d . src/*.js
git add .
git add -f coverage
git add -f dist
git add -f demo/index.html
git add -f demo/styles.html
git commit -m 'bump doc'
git push -fu origin gh-pages
git checkout master
