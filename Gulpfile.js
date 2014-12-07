var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

gulp.task('build', function() {
  gulp.src('sortable.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./'))
});
