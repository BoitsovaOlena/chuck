let gulp = require('gulp');
let sass = require('gulp-sass')
gulp.task('sass', function(){
  return gulp.src('./dist/sass/main.sass')
    .pipe(sass()) 
    .pipe(gulp.dest('./dist/css'))
});

//gulp sass