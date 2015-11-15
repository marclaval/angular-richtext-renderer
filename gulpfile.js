var gulp = require('gulp');
var typescript = require('gulp-typescript');
var child_process = require('child_process');

var PATHS = {
  sources: {
    src: 'src/**/*.ts',
    sample: 'sample/**/*.ts',
    resources: 'sample/**/*.html',
  },
  destination: 'build'
};

/**********************************************************************************/
/*******************************    NODE     **************************************/
/**********************************************************************************/
gulp.task('ts2commonjs', ['clean'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample');
  return ts2js(PATHS.sources.src, PATHS.destination + '/src');
});

gulp.task('sample.commonjs', ['ts2commonjs'], function(done) {
    child_process.exec('node ./build/sample/node/hello.js',
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            done();
        });
});

gulp.task('play.node', ['sample.commonjs'], function () {
    gulp.watch([PATHS.sources.src, PATHS.sources.sample], ['sample.commonjs']);
});

/**********************************************************************************/
/*******************************   BROWSER   **************************************/
/**********************************************************************************/
gulp.task('ts2system', ['clean'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample', true);
  return ts2js(PATHS.sources.src, PATHS.destination + '/src', true);
});

gulp.task('resources', ['ts2system'], function () {
  return gulp.src(PATHS.sources.resources).pipe(gulp.dest(PATHS.destination + '/sample'));
});

gulp.task('play.browser', ['resources'], function () {
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var open = require('open');

  var port = 9001, app;

  gulp.watch([PATHS.sources.src, PATHS.sources.sample], ['resources']);

  app = connect().use(serveStatic(__dirname));
  http.createServer(app).listen(port, function () {
    open('http://localhost:' + port + '/build/sample/browser/index.html');
  });
});


/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean', function (done) {
  var del = require('del');
  del(['build'], done);
});

function ts2js(path, dest, toSystem) {
  var tsResult = gulp.src(path)
    .pipe(typescript({
      noImplicitAny: true,
      module: toSystem ? 'system' : 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    }));
  return tsResult.js.pipe(gulp.dest(dest));
}