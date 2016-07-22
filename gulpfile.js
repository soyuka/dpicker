'use strict'
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const path = require('path')
const traceur = require('gulp-traceur')
const Transform = require('stream').Transform
const jhaml = require('@soyuka/jhaml')
const zlib = require('zlib')
const fs = require('fs')
const sass = require('node-sass')

const uml = (name, contents, inject) => {
  return `
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('${name}', [${inject.map((e) => "'" + e + "'").join(', ')}], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(${inject.map((e) => "require('" + e.toLowerCase() + "')").join(', ')});
    } else {
        // Browser globals (root is window)
        root.${name} = factory(${inject.map((e) => 'root.' + e).join(', ')});
    }
}(this, function (${inject.join(', ')}) {
${contents}
  return ${name.replace('DPicker.modules.', '')};
}));
`
}

function wrap() {
  const transformStream = new Transform({objectMode: true})
  transformStream._transform = function(file, encoding, callback) {
    let error = null
    let name = path.basename(file.path, '.js').replace('dpicker', 'DPicker')
    let inject = ['moment', 'maquette']

    if (name != 'DPicker') {
      inject = ['DPicker', 'moment']
      name = name.replace('DPicker', 'DPicker.modules')
    }

    name = name.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','')})


    file.contents = new Buffer(uml(name, file.contents.toString(), inject))

    callback(error, file)
  };

  return transformStream
};

gulp.task('default', function() {
  let name

  return gulp.src(['src/*.js', '!src/*.spec.js'])
  .pipe(traceur())
  .pipe(wrap())
  .pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist'))
})

// stolen from https://github.com/AFASSoftware/maquette/blob/master/gulpfile.js#L136
gulp.task('check-size', ['default'], function(callback) {
  const input = fs.createReadStream('./dist/dpicker.min.js')
  const stream = input.pipe(zlib.createGzip())
  let length = 0
  stream.on('data', function(chunk) {
    length += chunk.length
  });
  stream.on('end', function() {
    console.log('gzipped size in kB:', length/1024)
    if (length >= 3 * 1024) {
      return callback(new Error('Claim that dpicker is only 3 kB gzipped no longer holds'))
    }
    callback()
  })
})

gulp.task('build-styles', ['default'], function() {
  const styles = {}

  fs.readdirSync('./demo/styles').map(e => {
    let css = fs.readFileSync(`./demo/styles/${e}`)
    let style = sass.renderSync({data: `#${path.basename(e, '.css')} { ${css.toString()} }`})

    styles[path.basename(e, '.css')] =  {
      css: style.css.toString(),
      code: css.toString()
    }
  })

  const scope = {
    styles: styles
  }

  let output = fs.createWriteStream('./demo/styles.html')

  fs.createReadStream('./demo/styles.haml')
  .pipe(jhaml(scope))
  .pipe(output)

})

gulp.task('watch', ['default'], function() {
  gulp.watch(['src/*.js', '!src/*.spec.js'], ['default'])
})
