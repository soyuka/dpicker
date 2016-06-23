#!/bin/bash

[[ '' == $1 ]] && echo "Please provide patch, minor, major argument" && exit 1

gulp
newver=$(npm --no-git-tag-version version $1)
git add -f dist package.json
git commit -m $newver
git tag $newver
npm publish
git reset --hard HEAD~1
newver=$(npm --no-git-tag-version version $1)
git add package.json
git commit -m $newver
git push --tags
git push
