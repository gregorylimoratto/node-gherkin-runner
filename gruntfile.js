module.exports = function(grunt) {

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
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat', 'karma']
    },
    karma:{
      src:{
        configFile:'karma.conf.js',
        autoWatch:false,
        singleRun:true,
        reporters:['dots']
      }
    },
    'npm-publish':{
        abortIfDirty: false
    }
  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-npm');
  
  grunt.registerTask('default',  ['karma']); // , 
  grunt.registerTask('release',  ['npm-publish']);
};