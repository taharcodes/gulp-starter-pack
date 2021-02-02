const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const terser = require('gulp-terser')
const browsersync = require('browser-sync').create()

// Sass Task
function scssTask() {
  return src('app/scss/**/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest('dist/css', { sourcemaps: '.' }))
}

// JavaScript task
function jstask() {
  return src('app/js/**/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest('dist/js', { sourcemaps: '.' }))
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  })
  cb()
}

function browsersyncReaload(cb) {
  browsersync.reload()
  cb()
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReaload)
  watch(
    ['app/scss/**/*.scss', 'app/js/**/*.js'],
    series(scssTask, jstask, browsersyncReaload)
  )
}

// Default Gulp task
exports.default = series(scssTask, jstask, browsersyncServe, watchTask)
