var gulp = require('gulp');
var render = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');

gulp.task('browserSync',['default'] , function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('watch', ['browserSync'], function () {
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
    gulp.watch('app/**/*.css', browserSync.reload);
});
// writing up the gulp nunjucks task
gulp.task('nunjucks', function () {
    console.log('nunjucking');

    // configuring the templates folder for nunjucks
    render.nunjucks.configure(['app/templates/']);

    // get the pages files
    return gulp.src('app/pages/**/*.+(html)')
        .pipe(inject(gulp.src(['./app/css/*.+(css)', './app/js/**/*.+(js)'], { read: false }), { relative: true }))
        .pipe(render())
        .pipe(gulp.dest('./public'))
});

gulp.task('nunjucks-css' , function(){
    return gulp.src('app/css/**/*.+(css)')
    .pipe(gulp.dest('./public/css'))
});

gulp.task('nunjucks-js' , function(){
    return gulp.src('app/js/**/*.+(js)')
    .pipe(gulp.dest('./public/js'))
});

//default task to be run with gulp
gulp.task('default', ['nunjucks' , 'nunjucks-css' , 'nunjucks-js']);

/*
    Resource :
    https://www.tengio.com/blog/nunjucks-templates-with-gulp/

    MUST USE : version "gulp-nunjucks-render": "^1.1.10",

*/