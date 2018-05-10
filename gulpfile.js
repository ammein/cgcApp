var gulp = require('gulp');
var render = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var data = require('gulp-data');
var {Question} = require('./server/models/question');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

gulp.task('browserSync',['default'] , function () {
    browserSync.init({
        server: {
            baseDir: 'views'
        },
    })
});

gulp.task('watch', ['browserSync'], function () {
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('views/**/*.html', browserSync.reload);
    gulp.watch('views/**/*.js', browserSync.reload);
    gulp.watch('views/**/*.css', browserSync.reload);
});
// writing up the gulp nunjucks task
gulp.task('nunjucks', function () {
    console.log('nunjucking');

    // configuring the templates folder for nunjucks
    render.nunjucks.configure(['views/templates/']);

    // get the pages files
    return gulp.src('views/pages/**/*.+(html)')
        .pipe(inject(gulp.src(['./views/css/*.+(css)', './views/js/**/*.*.+(js)', './views/js/**/*.+(js)'], { read: false }), { relative: true }))
        .pipe(render())
        .pipe(gulp.dest('./public'))
        .pipe(gulp.dest('./views'))
});

gulp.task('nunjucks-css' , function(){
    return gulp.src('views/css/**/*.+(css)')
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('nunjucks-js' , function(cb){
    return gulp.src('views/js/**/*.+(js)')
    .pipe(gulp.dest('./public/js'))
});

gulp.task('jsonAnimate' , function(){
    return gulp.src('views/js/**/*.+(json)')
    .pipe(gulp.dest('./public/js'))
});

//default task to be run with gulp
gulp.task('default', ['nunjucks' , 'nunjucks-css' , 'nunjucks-js' , 'jsonAnimate']);

/*
    Resource :
    https://www.tengio.com/blog/nunjucks-templates-with-gulp/

    MUST USE : version "gulp-nunjucks-render": "^1.1.10",

*/