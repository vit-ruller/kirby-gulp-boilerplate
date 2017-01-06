process.env.NODE_ENV = 'dev';
var exec    = require('child_process').exec;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


// Run CSS through autoprefixed
gulp.task('css', function () {
  return gulp.src('style/main.scss')
    .pipe($.sass({
      errLogToConsole: true
    }))
    .on('error', function (err) {
      console.log(err);
      $.notify.onError()(err.message);
      this.emit('end');
    })
    .pipe($.autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    //.pipe($.cssnano())
    .pipe(gulp.dest('assets/css'))
    .pipe($.livereload({ start: true }));
});

// Combine js
new function() {
  var browserify = require('browserify');
  var babelify = require('babelify');
  var glob = require('glob');
  var source = require('vinyl-source-stream');
  var buff = require('vinyl-buffer');
  var envify = require('envify/custom');

  gulp.task('js', function () {
    var files = glob.sync('./src/**/*.js');

    return browserify({
      entries: files,
      debug: true
    })
      .transform('babelify', {presets: ['es2015']})
      .transform(envify())
      .bundle()
      .on('error', function(err){
        this.emit('end');
        $.notify.onError()(err);
      })
      .pipe(source('main.js'))
      .pipe(buff())
      .pipe(gulp.dest('assets/js'))
      .pipe($.rename('main-min.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('assets/js'));
  });
};

gulp.task('all',['css','js'], function() {

});
// gulp.task('html', ['copy', 'js', 'css'], function() {
//   return gulp.src('assets/index.html')
//     .pipe($.header(banner, { pkg : require('./package.json') } ))
//     .pipe(gulp.dest('dist/'))
//     .pipe($.livereload());
// });

// Copy html and assets to dist
// gulp.task('copy', function () {
//   return gulp.src(['assets/**/**'], {base: 'assets/'})
//     .pipe(gulp.dest('dist'));
// });

// Watch
gulp.task('watch', function () {
  gulp.watch('./style/**/*.scss', ['css']);
  gulp.watch('./src/**/*.js', ['js']);
});

// Default
gulp.task('default', ['all', 'watch']);

// Set-production
gulp.task('set-production', function() {
  process.env.NODE_ENV = 'production';
});


//deploy to server
gulp.task('deploy', function (cb) {
  var cmd = 'rsync -rtvzh -ssh --progress --del  thumbs kirby panel assets site index.php .htaccess preview@128.199.58.38:apps/vit-ruller-preview/public/anthropocene';

  exec(cmd, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
