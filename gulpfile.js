var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function(){
    return gulp.src('./public/css/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function(){
    gulp.watch('public/css/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'watch']);