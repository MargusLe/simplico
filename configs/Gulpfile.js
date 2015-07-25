/**
 * Gulpfile.js
 *
 * @author Villem Alango <villem.alango@gmail.com>
 * @created 26.06.15 23:44
 * @license private
 */

(function () {

  'use strict';

   //  Directories we want to process ... jshint or otherwise
  var JSDIRS = ['dev', 'tests', 'srv', 'configs'];
  //  Stuff we don't want to touch
  var IGNORE = ['**/lib/require.js', '**/lib/domReady.js', '**/ol3-*.js'];
  //  jshint options file name
  var JSHX = '.jshintrc';

  var gulp    = require('gulp')
    , path    = require('path')
    , ignorer = require('gulp-ignore')
    , jshint  = require('gulp-jshint')
    , stylish = require('jshint-stylish')
      /* globals console: false  */
    , debug   = console.log.bind(console, '#')
    ;
  var sep     = path.sep
    , homeDir = path.normalize(__dirname + sep + '..')
    , allJs   = ['**', '*.js'].join(sep)
    , jshxLen = JSHX.length
    , jsPaths, rulePaths
    ;

  //  Initialize the paths
  jsPaths = JSDIRS.map(function (p) {
    return [homeDir, p, allJs].join(sep);
  });
  rulePaths = JSDIRS.map(function (p) {
    return [homeDir, p, '**', '.jshintrc'].join(sep);
  });

// JSHINT
// @link(https://www.npmjs.com/package/gulp-jshint)
// @link(http://jshint.com/docs/)
// NB: unless `lookup` option is set to false,
// linter will search for ".jshintrc" in the file's directory and then
// climb upwards.

  function hinter(fspec, opt_options) {
    return gulp.src(fspec).pipe(jshint(opt_options))
      .pipe(jshint.reporter(stylish));
  }

  // ==================  Tasks  ===================

  /*
   Watch for source file changes.
   NB: this does not detect new file creation!
   */
  gulp.task('watch', function () {
    //debug('=== watch ===');
    gulp.watch(jsPaths, function (ev) {
      if (ev.type !== 'deleted') {
        debug('watch:', ev.path);
        hinter(ev.path);
      }
    });
  });

  /*
   When .jshintrc file is changed, run jshint for affected directories.
   */
  gulp.task('hint-watch', function () {
    //debug('=== hint-watch ===');
    gulp.watch(rulePaths, function (ev) {
      var p = ev.path;
      p = p.substr(0, p.length - jshxLen) + allJs;
      debug('hwatch:', p);
      hinter(p);
    });
  });

  /*
   Run-once jshint task.
   */
  gulp.task('lint', function () {
    //debug('=== lint ===');
    gulp.src(jsPaths)
      .pipe(ignorer.exclude(IGNORE))
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  // Define the default task as a sequence of the above tasks
  gulp.task('default', ['lint', 'watch', 'hint-watch']);

}());
