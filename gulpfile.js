const gulp = require('gulp');

gulp.task('prebuild', function() {
  return gulp.src('src/**')
    .pipe(gulp.dest('lib/'));
});
