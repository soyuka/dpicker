#!env /bin/sh

build() {
  command="$(npm bin)/browserify"
  args="-g unassertify -t babelify"

  if [[ $2 == 1 ]]; then
        args="-s DPicker $args"
  fi

  sh -c "$command $args src/$1 -o dist/$1"
  sh -c "$command -g uglifyify $args src/$1 -o dist/$1.min.js"
}

rm dist/*
build "dpicker.js" 1 &
build "dpicker.time.js" &
build "dpicker.modifiers.js" &
build "dpicker.arrow-navigation.js" &

wait

exit 0
