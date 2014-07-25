var gulp = require('gulp'),
    less = require('gulp-less'),
    fileinclude = require('gulp-file-include'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    clean = require('gulp-rimraf'),
    browserSync = require('browser-sync');

var src = './src';
var out = './build';
var libs = './libs';

gulp.task('default', function(callback) {
    return runSequence('build', 'watch', 'browser-sync', callback);
});

gulp.task('browser-sync', function () {
    var files = [
        out + '/*.html',
        out + '/**/*.*',
        libs + '/**/*.*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: out,
        },
        open: false
    });
});

gulp.task('styles', function(){
    return  gulp.src(src + '/less/app.less')
            .pipe(less())
            .on('error', gutil.log)
            .pipe(gulp.dest(out + '/stylesheets/'));
});

gulp.task('build', function(callback){
    return runSequence([ 'fileinclude', 'styles', 'images', 'javascripts', 'jslibs'], callback);
});

gulp.task('jslibs', function(){
    return gulp.src( [libs + '/jquery/dist/**', libs + '/bootstrap/dist/js/**'])
        .pipe(gulp.dest(out + '/javascripts/vendor/'));
});

gulp.task('images', function(){
    return gulp.src( src + '/images/**')
        .pipe(gulp.dest(out + '/images/'));
});


gulp.task('fileinclude', function() {
    return gulp.src([ src + '/templates/index.html', src + '/templates/page-*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(out + '/'));
});

gulp.task('javascripts', function(){
    return gulp.src( src + '/javascripts/**')
        .pipe(gulp.dest(out + '/javascripts/'));
});



gulp.task('watch', function () {
    gulp.watch(src + '/templates/*.html', ['fileinclude']);
    gulp.watch([ src + '/less/*.less', src + '/less/**/*.less'], ['styles']);
    gulp.watch(src + '/images/*.*', ['images']);
    gulp.watch(src + '/javascripts/*.*', ['javascripts']);
});

gulp.task('clean', function () {
    return gulp.src([libs + '/**/*.*', libs + '/**/**', libs + '/**'], {read: false})
        .pipe(clean());
});