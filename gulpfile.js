'use strict';

var gulp = require('gulp-help')(require('gulp'));
var initGulpTasks = require('react-component-gulp-tasks');
var ghPages = require('gulp-gh-pages');


/**
 * Task configuration is loaded from config.js
 *
 * Make any changes to the source or distribution files
 * and directory configuration there
 */

var config = require('./gulpconfig');


/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */

initGulpTasks(gulp, config);

gulp.task('deploy', ['build'], function() {
  return gulp.src('./example/dist/**/*')
    .pipe(ghPages());
});
