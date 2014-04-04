'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    config: grunt.file.readJSON('config.json'),

    compress: {
      vendor: {
        files: [{
          src: 'dist/vendor.js',
          dest: 'dist/vendor.js'
        }],

        options: {
          ext: false,
          mode: 'gzip',
          level: 9
        }
      }
    },

    concat: {
      vendor: {
        files: [{
          src: [
            'vendor/jquery/dist/jquery.min.js',
            'vendor/handlebars/handlebars.min.js',
            'vendor/ember/ember.min.js'
          ],

          dest: 'dist/vendor.js'
        }]
      }
    },

    fastly: {
      options: {
        key: '<%= config.fastly_key %>'
      },

      vendor: {
        options: {
          purgeAll: true,
          serviceId: '<%= config.fastly_service_id %>'
        }
      }
    },

    s3: {
      options: {
        key   : '<%= config.key %>',
        secret: '<%= config.secret %>',
        bucket: '<%= config.bucket %>',
        access: 'public-read',
        headers: {
          "Cache-Control": "max-age=630720000, public",
          "Expires"      : new Date(Date.now() + 63072000000).toUTCString()
        }
      },

      vendor: {
        upload: [{
          src    : 'dist/vendor.js.gz',
          dest   : 'vendor.js.gz',
          options: { gzip: true }
        }, {
          src    : 'dist/vendor.js',
          dest   : 'vendor.js',
          options: { gzip: true }
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-fastly');
  grunt.registerTask('default', ['concat', 'compress', 's3', 'fastly']);
}
