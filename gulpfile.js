const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const webp = require('gulp-webp');
//const avif = require('gulp-avif');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');

function pages(){
  return src('app/pages/*.html')
  .pipe(include({
    includePaths: 'app/components'
  }))
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}

function fonts(){
  return src('app/fonts/src/*.*')
  .pipe(fonter({
    formats: ['woff','ttf']
  }))
  .pipe(src('app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('app/fonts'))
}

function images() {
  return src(['app/images/src/*.*', '!app/images/src/*.svg'])
  //.pipe(newer('app/images/dist'))
  //.pipe(avif({ quality: 50})) 

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(webp())  

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(imagemin())

  .pipe(dest('app/images'))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'app/js/main.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/ion-rangeslider/js/ion.rangeSlider.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('app/scss/style.scss')
  .pipe(concat('style.min.css'))
  .pipe(scss({outputStyle: 'compressed'}))
  .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions']}))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function watching() {
   browserSync.init({
    server: {
      baseDir: "app/"
    },
    notofy: false
  })
  watch(['app/scss/style.scss'], styles)
  watch(['app/images/src'], images)
  watch(['app/js/main.js'], scripts)
  watch(['app/components/*', 'app/pages/*'], pages)
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function building() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/images/*.*',
    'app/images/*.svg',
    'app/fonts/*.*'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

function cleanDist() {
  return src('dist')
  .pipe(clean())
}

exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
exports.fonts = fonts;
exports.pages = pages;
exports.building = building;
exports.watching = watching;
exports.build = series(cleanDist,building);
exports.default = parallel(styles, scripts, pages, watching);