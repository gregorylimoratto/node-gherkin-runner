var gulp = require('gulp');
var mocha = require('gulp-mocha');

var scenariosSources = ['./tests/**/*.js', require('./lib/gherkin-runner.js').runnerPath];

function runTest(source) {
    return gulp.src(source, {read: false})
        .pipe(mocha());
}

gulp.task('test:scenarios', function () {
    return runTest(scenariosSources);
});

gulp.task('watch', ['test:scenarios'], function(){
	gulp.watch(['./tests/**/*.js', './tests/**/*.feature'], ['test:scenarios']);
});