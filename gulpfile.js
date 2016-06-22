const gulp = require('gulp')
const wrap = require('gulp-wrap')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const uml = `
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker', ['moment', 'maquette'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('moment'), require('maquette'));
    } else {
        // Browser globals (root is window)
        root.DPicker = factory(root.moment, root.maquette);
    }
}(this, function (moment, maquette) {
  <%= contents %>
  return DPicker
}));
`

gulp.task('default', function() {
  return gulp.src(['src/dpicker.js'])
  .pipe(babel({presets: ['es2015']}))
  .pipe(wrap(uml))
  .pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename('dpicker.min.js'))
  .pipe(gulp.dest('dist'))
})
