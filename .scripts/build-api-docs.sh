#!env bash
$(npm bin)/jsdoc2md --template .scripts/template.hbs -f src/dpicker.js src/plugins/*.js src/adapters/*.js > docs/_api.md
