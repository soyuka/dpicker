#!env bash
bash .scripts/build.sh docs
cp dist/dpicker.all.min.js docs/demo/public/dist
cp CHANGELOG.md docs/CHANGELOG.md
cd docs/demo
npm install
NODE_ENV=production $(npm bin)/webpack --config config/webpack.config.js
cd ../../
bash .scripts/build-api-docs.sh
