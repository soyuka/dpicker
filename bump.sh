#!/bin/bash

[[ '' == $1 ]] && echo "Please provide patch, minor, major argument" && exit 1

gulp
git add -f dist
newver=$(npm --no-git-tag-version version $1)
git commit -m $newver
npm publish
git reset --hard HEAD~1
