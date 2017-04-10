#!env /bin/bash

markdox src/dpicker.js -o docs/api/dpicker.md

for f in src/adapters/*.js; do
  b=$(basename $f)
  echo "Api docs for $b"
  markdox $f -o docs/api/adapters_${b/\.js/\.md}
done

for f in src/plugins/*.js; do
  b=$(basename $f)
  echo "Api docs for $b"
  markdox $f -o docs/api/plugins_${b/\.js/\.md}
done

rm docs/_api.md &> /dev/null
touch docs/_api.md
echo "# DPicker" >> docs/_api.md
cat docs/api/dpicker.md >> docs/_api.md
echo "# Plugins" >> docs/_api.md
cat docs/api/plugins_* >> docs/_api.md
echo "# Adapters" >> docs/_api.md
cat docs/api/adapters_** >> docs/_api.md
