#!env /bin/sh

browserify="$(npm bin)/browserify"
uglifyjs="$(npm bin)/uglifyjs"

build() {
  args="-g unassertify -t babelify"

  if [[ $2 == 1 ]]; then
        args="-s DPicker $args"
  fi

  sh -c "$browserify $args src/$1 -o dist/$1.js"
  sh -c "$browserify -g uglifyify $args src/$1 | $uglifyjs -c > dist/$1.min.js"
}

rm dist/* &> /dev/null
mkdir dist &> /dev/null
build "dpicker" 1 &
build "dpicker.time" &
build "dpicker.modifiers" &
build "dpicker.arrow-navigation" &
$browserify -g uglifyify src/polyfills.js -o dist/polyfills.min.js &

wait

echo "dpicker.min.js.gz: " $(node -pe "$(gzip -c dist/dpicker.min.js | wc -c) * 0.001") kb
echo "dpicker.time.min.js.gz: " $(node -pe "$(gzip -c dist/dpicker.time.min.js | wc -c) * 0.001") kb

exit 0
