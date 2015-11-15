var gulp = require('gulp');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var fork = require('child_process').fork;
var karma = require('karma').Server;
var path = require('path');
var runSequence = require('run-sequence');
var through2 = require('through2');

var PATHS = {
  sources: {
    src: 'src/**/*.ts',
    sample: 'sample/**/*.ts',
    test: 'test/**/*.ts',
    resources: 'sample/**/*.html',
  },
  destination: 'build'
};

/**********************************************************************************/
/*******************************    NODE     **************************************/
/**********************************************************************************/
gulp.task('ts2commonjs', ['clean'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample');
  ts2js(PATHS.sources.test, PATHS.destination + '/test', false, true);
  return ts2js(PATHS.sources.src, PATHS.destination + '/src');
});

gulp.task('sample.commonjs', ['ts2commonjs'], function(done) {
  exec('node ./build/sample/node/hello.js',
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

gulp.task('transformTests', ['ts2commonjs'], function() {
  return gulp.src(PATHS.destination + '/test/**/*')
    .pipe(transformCommonJSTests())
    .pipe(gulp.dest(PATHS.destination + '/test'));
});

var treatTestErrorsAsFatal = true;
gulp.task('test.node/ci', function(done) {
  runJasmine([PATHS.destination + '/test/**/*_spec.js'], done);
});

gulp.task('test.node', ['transformTests'], function(neverDone) {
  treatTestErrorsAsFatal = false;
  runSequence(
    'test.node/ci',
    function() {
      watch([PATHS.sources.src, PATHS.sources.test], function() {
        runSequence('transformTests', 'test.node/ci');
      });
    }
  );
});

/**********************************************************************************/
/*******************************   BROWSER   **************************************/
/**********************************************************************************/
gulp.task('ts2system', ['clean'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample', true);
  ts2js(PATHS.sources.test, PATHS.destination + '/test', true, true);
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

gulp.task('karma-launch', function() {
  new karma({
    configFile: path.join(__dirname, 'karma.conf.js')
  }).start();
});

gulp.task('karma-run', function (done) {
  runKarma('karma.conf.js', done);
});

gulp.task('test.browser', ['ts2system'], function (neverDone) {
  runSequence(
    'karma-launch',
    function() {
      watch([PATHS.sources.src, PATHS.sources.test], function() {
        runSequence('ts2system', 'karma-run');
      });
    }
  );
});

gulp.task('test.browser/ci', function(done) {
  new karma({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});


/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean', function (done) {
  var del = require('del');
  del(['build'], done);
});

function ts2js(path, dest, toSystem, isSilent) {
  var tsResult = gulp.src(path)
    .pipe(typescript({
      noImplicitAny: true,
      module: toSystem ? 'system' : 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    },
      undefined,
      //TODO: remove once angular2/testing typings are solved
      isSilent ? typescript.reporter.nullReporter() : typescript.reporter.defaultReporter()));
  return tsResult.js.pipe(gulp.dest(dest));
}

function runKarma(configFile, done) {
  var cmd = process.platform === 'win32' ? 'node_modules\\.bin\\karma run ' :
    'node node_modules/.bin/karma run ';
  cmd += configFile;
  exec(cmd, function(e, stdout) {
    // ignore errors, we don't want to fail the build in the interactive (non-ci) mode
    // karma server will print all test failures
    done();
  });
}

function runJasmine(globs, done) {
  var args = ['--'].concat(globs);
  fork('./jasmine-test-shim', args, {stdio: 'inherit'})
    .on('close', function jasmineCloseHandler(exitCode) {
      if (exitCode && treatTestErrorsAsFatal) {
        var err = new Error('Jasmine tests failed');
        // Mark the error for gulp similar to how gulp-utils.PluginError does it.
        // The stack is not useful in this context.
        err.showStack = false;
        done(err);
      } else {
        done();
      }
    });
}

function transformCommonJSTests() {
  return through2.obj(function (file, encoding, done) {
    var content = `var parse5Adapter = require('angular2/src/core/dom/parse5_adapter');\r\n` +
      `parse5Adapter.Parse5DomAdapter.makeCurrent();\r\n` + String(file.contents);
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}