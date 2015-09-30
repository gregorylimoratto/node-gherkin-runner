module.exports = function(grunt) {
  console.error(require('./lib/gherkin-runner.js'));
  grunt.initConfig({
    jshint: {
      options:{
        camelcase: true,
        strict: true,
        trailing: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        globals: {}
      },
      files: ['lib/**/*.js', 'tests/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests/**/*.js', require('./lib/gherkin-runner.js').runnerPath]
      }
    },
    'npm-publish':{
        abortIfDirty: false
    }
  });

  // TODO : extract featureFileBasePath into a config module file
  global.featureFileBasePath = require.resolve('./') + "\\..\\..\\"
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-npm');
  
  grunt.registerTask('default', 'mochaTest');
  grunt.registerTask('release',  ['mochaTest', 'npm-publish']);
};