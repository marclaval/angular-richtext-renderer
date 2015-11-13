var gulp = require('gulp');

var PATHS = {
  src: ['src/**/*.ts', 'sample/**/*.ts']
};

gulp.task('clean', function (done) {
  var del = require('del');
  del(['dist'], done);
});

gulp.task('ts2cjs', ['clean'], function () {
  var typescript = require('gulp-typescript');
  var tsResult = gulp.src(PATHS.src)
    .pipe(typescript({
      noImplicitAny: true,
      module: 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    }));

  return tsResult.js.pipe(gulp.dest('dist'));
});