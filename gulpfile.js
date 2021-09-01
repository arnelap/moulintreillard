const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const purgecss = require('gulp-purgecss');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const concatcss = require('gulp-concat-css');

const uglify = require('gulp-uglify');
const concatjs = require('gulp-concat');

const newer = require('gulp-newer');
const imageResize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const mozjpeg = require ('imagemin-mozjpeg');

const del = require('del');
const cp = require('child_process');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');

const paths = {
  styles: {
    src: '_assets/css/*.css',
    dest: '_site/assets/css'
  },
  scripts: {
    src: '_assets/js/*.js',
    dest: '_site/assets/js'
  },
  images: {
    src: '_assets/*.+(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP|tif|TIF)',
    dest: 'assets'
  }
};



function process_image(opt_res, opt_img, opt_ren) {
return gulp.src([paths.images.src])
.pipe(newer(paths.images.dest))
.pipe(imageResize(opt_res))
.pipe(imagemin(opt_img))
.pipe(rename(opt_ren))
.pipe(gulp.dest(paths.images.dest))
.pipe(browserSync.reload({stream:true}))
}

//function imgxs() { return process_image({width : '30'}, [imageminWebp({quality: 50})], {prefix: 'xs-', extname: ".webp"}); }
function imgxs() { return process_image({width : '100'}, [mozjpeg(), pngquant()], {prefix: 'xs-'}); }

//function imgmd() { return process_image({width : '300'}, [imageminWebp({quality: 50})], {prefix: 'md-', extname: ".webp"}); }
function imgmd() { return process_image({width : '600'}, [mozjpeg(), pngquant()], {prefix: 'md-'}); }


//function imgxl() { return process_image({width : '1400'}, [imageminWebp({quality: 50})], { extname: ".webp"}); }
function imgxl()  { return process_image({width : '1900'}, [mozjpeg(), pngquant()], {}); }



function clean() {
    return  del(['assets/*']);

}

function browserSyncServe(done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.htm"
    }
  })
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch(paths.images.src, gulp.parallel(imgxs, imgmd, imgxl))
  gulp.watch(
    [
    '*.htm',
    '*.jpg'
  ],
  gulp.series(browserSyncReload));
}

gulp.task('imgxl', gulp.series(imgxl))
gulp.task('dev', gulp.parallel(browserSyncServe, watch))
gulp.task('default', gulp.parallel(browserSyncServe, watch))
gulp.task('rebuild', gulp.series(clean, imgxs, imgmd, imgxl, browserSyncServe, watch))

gulp.task('img', gulp.parallel(imgxs, imgmd, imgxl))
gulp.task('clean', gulp.series(clean))

gulp.task('netlify', gulp.parallel(imgxs, imgmd, imgxl))
