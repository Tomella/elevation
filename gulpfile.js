var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var rollup = require('rollup-stream');
var rollupTypescript = require('rollup-plugin-typescript');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('typescript');
var tslint = require("gulp-tslint");
var uglify = require('gulp-uglify');


var ASSETS_BASE = "dist";


gulp.task('libs', function() {
  return rollup({
      entry: './source/libs.ts',
      plugins: [
         rollupTypescript({typescript:ts})
      ],
		format: 'umd',
		moduleName: 'Elevation',
    })
    .pipe(source('elevation.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('dist', ['libs'], function () {
   return gulp.src(['dist/*.js', '!dist/*.min.js'])
      .pipe(uglify())
      .pipe(rename({
         extname: '.min.js'
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task("tslint", function() {
    return gulp.src("source/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report({
            emitError: false
        }));
});

// Watch Files For Changes
gulp.task('watch', function () {
   // We'll watch JS, SCSS and HTML files.
   gulp.watch('source/**/*.ts', ['tslint', 'dist']);
});

gulp.task('clean', function (cb) {
   return del(["dist"], cb);
});

gulp.task('default', ['dist', 'tslint', 'watch']);