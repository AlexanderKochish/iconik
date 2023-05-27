const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const browserSync = require('browser-sync').create();


const paths = {
    html:{
        src:'src/*.html',
        dest:'dist'
    },
    img:{
        src:'src/images/**/*.{png,jpg,svg}',
        dest:'dist/images/'
    },
    styles:{
        src:'src/styles/**/*.scss',
        dest:'dist/styles/'
    },
    scripts:{
        src:'src/js/**/*.js',
        dest:'dist/js/'
    }
}

function cleanDist () {
    return del(['dist'])
}
function html () {
    return src(paths.html.src)
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(size({showFiles:true}))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream())
}

function styles () {
    return src(paths.styles.src)
    .pipe(scss())
    .pipe(cleanCSS())
    .pipe(rename({
        basename:'main.',
        suffix:'min'
    }))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function scripts () {
    return src(paths.scripts.src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}
function image () {
    return src(paths.img.src)
    .pipe(size({
        showFiles:true
    }))
    .pipe(dest(paths.img.dest))
}

function watching () {
    browserSync.init({
        server:{
            baseDir:'./dist'
        },
        port: 3000,
        notify: false
    })
    watch(paths.html.dest).on('change',browserSync.reload)
    watch(paths.html.src, html)
    watch(paths.scripts.src, scripts)
    watch(paths.styles.src, styles)
    watch(paths.img.src, image)
}

let build = series(cleanDist,html, parallel(styles,scripts,image),watching)

exports.cleanDist = cleanDist;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.image = image;
exports.watching = watching;

exports.default = build;