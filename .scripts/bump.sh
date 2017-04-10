#!env bash

[[ '' == $1 ]] && echo "Please provide patch, minor, major argument" && exit 1

tag='next'

if [[ $1 == 'patch' || $1 == 'minor' || $1 == 'major' ]]; then
        tag='latest'
fi

bash .scripts/build.sh forpublish
npm test
newver=$(npm --no-git-tag-version version $1)
git add -f dist package.json
git commit -m $newver
git tag $newver
npm publish --tag $tag
git reset --hard HEAD~1
newver=$(npm --no-git-tag-version version $1)
git add package.json
git commit -m $newver
git push --tags
git push
