var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "."
        }
    });

    gulp.watch("*.html").on("change, browserSync.reload");
});

gulp.task('styles', function() {
  // place code for your default task here
  gulp.src('sass/**/*.scss')
  	.pipe(sass().on('error' , sass.logError))
  	.pipe(gulp.dest('./css'));
});
