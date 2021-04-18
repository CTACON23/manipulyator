const {src,dest,watch,parallel,series} = require('gulp')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const autoPrefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const del = require('del')

function browsersync(){
    browserSync.init({
        server: {
            baseDir:'src/'
        }
    })
}

function images(){
    return src('src/images/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/images'))
}

function styles(){
    return src('src/scss/style.scss')
        .pipe(scss({outputStyle:'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoPrefixer({
            overrideBrowserslist:['last 10 version']
        }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
}

function watching(){
    watch(['src/scss/**/*.scss'],styles)
    watch(['src/*.html']).on('change', browserSync.reload)
}

function cleanDist(){
    return del('dist')
}

function build(){
    return src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        'src/*.html'
    ],{base:'src'})
        .pipe(dest('dist'))
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.images = images
exports.cleanDist = cleanDist

exports.build = series(cleanDist,images,build)
exports.default = parallel(styles,browsersync,watching)