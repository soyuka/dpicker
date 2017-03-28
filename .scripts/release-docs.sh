#!env bash
DPICKER_VERSION=$(jq -r .version package.json)

git checkout gh-pages
git reset --hard origin/master
bash .scripts/build-docs.sh
mv -f docs/* .
sed -i.bak "s/DPICKER_VERSION/$DPICKER_VERSION/g" _coverpage.md
sed -i.bak "s/DPICKER_VERSION/$DPICKER_VERSION/g" README.md
rm *.bak
touch .nojekyll
git add -f *.md
git add .nojekyll index.html logo.svg demo
git add -f demo/public/dist
git commit -m 'bump doc'
git push -fu origin gh-pages
rm -r demo
rm index.html logo.svg
git checkout master
git reset --hard origin/master
