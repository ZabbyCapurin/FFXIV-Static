var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var react = require('gulp-react');
var webpackConfig = require('./webpack.config');


gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('sass', function(){
    return gulp.src('src/styles/*.scss')
        .pipe(sass()) // Using gulp-sass
        // .pipe(gulp.dest('src/styles/output'))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('webpackStream', function() {
    return gulp.src('src/scripts/output/*.js')
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('react', function() {
    return gulp.src('src/templates/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist/templates'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// gulp.task('useref', function() {
//     return gulp.src('src/*.html')
//         .pipe(useref())
//         .pipe(gulpIf('*.css', cssnano()))
//         .pipe(gulp.dest('dist'))
// });
gulp.task('copy', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
    gulp.watch('src/styles/*.scss', ['sass']);
    // gulp.watch('src/styles/output/*.css', ['useref']);
    gulp.watch('src/scripts/**/*.js', ['webpackStream']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/templates/*.jsx', browserSync.reload);
});

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'react', 'webpackStream', 'browserSync'], 'copy', 'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
      'clean:dist',
      'sass',
      'react',
      'webpackStream',
      ['copy'],
      callback
    )
});