/*
 * grunt-svn-export
 * https://github.com/francisbyrne/grunt-svn-export
 *
 * Copyright (c) 2013 byrnify
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('svn_export', 'Your task description goes here.', function() {
    var exec = require('child_process').exec;
    var options = this.options({
      bin:        'svn',
      repository: '',
      output:     'src'
    });
    grunt.verbose.writeflags(options, 'Options');
    grunt.log.write('Exporting from ' + options.repository + '\n');

    var done = this.async();
    var command = [ options.bin, 'export', options.repository, options.output ].join(' ');

    exec(command, function (error, stdout) {
      grunt.log.write(stdout);
      if (error !== null) {
        grunt.log.error('\n#' + command + "\n" + error);
      }
      done(true);
    });
  });
};
