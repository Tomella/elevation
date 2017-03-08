var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var gulpTs = require('gulp-typescript');
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
      entry: './source/index.ts',
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

// I'm too stupid to work out how to generate a single index.d.ts so I just join
// up all the definitions and manually edit the duplicates and chuck a namespace around them.
gulp.task('definitions', ['buildDefinitions'], function() {
   return gulp.src('./dist/definitions/**/*.ts')
    .pipe(concat('index.d.ts'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('buildDefinitions', function() {
    var tsResult = gulp.src('source/**/*.ts')
        .pipe(gulpTs({
         "target": "es6",
         "declaration": true
    }));
    return tsResult.dts.pipe(gulp.dest('dist/definitions'));
});
// End of my stupidity.

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