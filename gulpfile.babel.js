const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const zip = require('gulp-zip')

const paths = {
  styles: {
    src: [
      'assets-src/styles/all.sass',
      'assets-src/styles/amp-custom.sass',
      'assets-src/styles/ghost-admin.sass'
    ],
    dest: 'assets/styles'
  },
  scripts: {
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/reframe.js/dist/jquery.reframe.min.js',
      'node_modules/reframe.js/dist/jquery.noframe.min.js',
      'node_modules/sticky-kit/dist/sticky-kit.min.js',
      'assets-src/scripts/all.js'
    ],
    dest: 'assets/scripts'
  },
  images: {
    src: 'assets-src/images/**',
    dest: 'assets/images'
  },
  fonts: {
    src: 'assets-src/fonts/**',
    dest: 'assets/fonts'
  }
}

//
// Private tasks
//

function zipTheme() {
  let pkg = require('./package.json')
  let filename = pkg.name + '-' + pkg.version + '.zip'
  return gulp.src([
    '**',
    '!' + filename,
    '!node_modules/**',
    '!package-lock.json'
  ], { dot: true })
    .pipe(zip(filename))
    .pipe(gulp.dest('.'))
}

//
// Public tasks
//

export function buildStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: false
    }).on('error', sass.logError))
    .pipe(cleanCSS({
      level: {
        2: {
          all: true
        }
      }
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles.dest))
}

export function buildScripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

export function buildImages() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
}

export function buildFonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

export const build = gulp.parallel(buildStyles, buildScripts, buildImages, buildFonts)
export const archive = gulp.series(build, zipTheme)

// Default task

export default build
