#!env bash

browserify="$(npm bin)/browserify"
uglifyjs="$(npm bin)/uglifyjs"

GLOBAL_ARGS="-g unassertify -t babelify -x moment"
MIN_ARGS="$GLOBAL_ARGS -g uglifyify"

RELEASE_BUILD=0
if [[ $1 != '' ]]; then
  RELEASE_BUILD=1
fi

build() {
  args=$GLOBAL_ARGS

  if [[ $3 == 1 ]]; then
        args="-s dpicker $args"
  else
        args="-s ${2/./_} $args"
  fi

  echo  "Browserifying src/$1 => $2"
  sh -c "$browserify $args src/$1 -o dist/$2.js"

  if [[ $RELEASE_BUILD == 1 ]]; then
    echo  "Browserifying src/$1 => $2.min.js"
    sh -c "$browserify -g uglifyify $args src/$1 | $uglifyjs -c > dist/$2.min.js"
  fi
}

rm dist/* &> /dev/null
mkdir dist &> /dev/null

echo
echo "Build"

build "dpicker.moment" "dpicker" 1 &
build "dpicker" "dpicker.core" 1 &
build "plugins/time" "dpicker.time" &
build "plugins/modifiers" "dpicker.modifiers" &
build "plugins/arrow-navigation" "dpicker.arrow-navigation" &
build "plugins/navigation" "dpicker.navigation" &

wait

if [[ $RELEASE_BUILD == 1 ]]; then
  echo
  echo  "Build release files"

  # Build date + time
  echo  "Browerifying datetime"
  sh -c "$browserify $GLOBAL_ARGS -s dpicker src/datetime.js -o dist/dpicker.datetime.js"
  sh -c "$browserify $MIN_ARGS -s dpicker src/datetime.js -o dist/dpicker.datetime.min.js"
  # Build all
  echo  "Browerifying all"
  sh -c "$browserify $GLOBAL_ARGS -s dpicker src/all.js -o dist/dpicker.all.js"
  sh -c "$browserify $MIN_ARGS -s dpicker src/all -o dist/dpicker.all.min.js"

  echo  "Browserifying polyfills"
  $browserify -g uglifyify src/polyfills.js -o dist/polyfills.min.js

  echo
  echo "Sizes"

  for f in dist/*.min.js; do
    echo "$f.gz: " $(node -pe "$(gzip -c $f | wc -c) * 0.001") kb
  done
fi

exit 0
