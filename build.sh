#!env /bin/sh

browserify="$(npm bin)/browserify"

build() {
  args="-g unassertify -t babelify"

  if [[ $2 == 1 ]]; then
        args="-s DPicker $args"
  fi

  sh -c "$browserify $args src/$1 -o dist/$1"
  sh -c "$browserify -g uglifyify $args src/$1 -o dist/$1.min.js"
}

rm dist/* &> /dev/null
mkdir dist &> /dev/null
build "dpicker.js" 1 &
build "dpicker.time.js" &
build "dpicker.modifiers.js" &
build "dpicker.arrow-navigation.js" &
$browserify -g uglifyify src/polyfills.js -o dist/polyfills.min.js &

wait

exit 0
