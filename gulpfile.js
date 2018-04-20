var gulp = require('gulp');
var render = require('gulp-nunjucks-render');

// gulp.task('nunjucks', function () {
//     return gulp.src('src/pages/**/*.+(nj)')
//         .pipe(render({
//             path: ['src/templates']
//         }))
//         .pipe(gulp.dest('public'))
// });


// writing up the gulp nunjucks task
gulp.task('nunjucks', function () {
    console.log('nunjucking');

    // configuring the templates folder for nunjucks
    render.nunjucks.configure(['src/templates/']);

    // get the pages files
    return gulp.src('src/pages/**/*.+(html)')
        .pipe(render())
        .pipe(gulp.dest('src'))
});

//default task to be run with gulp
gulp.task('default', ['serve']);

/*
    Resource :
    https://www.tengio.com/blog/nunjucks-templates-with-gulp/

    MUST USE : version "gulp-nunjucks-render": "^1.1.10",

*/