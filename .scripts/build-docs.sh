#!env bash
bash .scripts/build.sh docs
cp CHANGELOG.md docs/CHANGELOG.md
cd docs/demo
npm install
NODE_ENV=production $(npm bin)/webpack --config config/webpack.config.js
cd ../../
bash .scripts/build-api-docs.sh
