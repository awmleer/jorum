const gulp = require('gulp')
const clean = require('gulp-clean')

gulp.task('clean-lib', function () {
  return gulp.src('lib', { read: false })
    .pipe(clean())
})

// gulp.task('prebuild', ['clean-lib'], function() {
//   return gulp.src('src/**')
//     .pipe(gulp.dest('lib/'))
// })
