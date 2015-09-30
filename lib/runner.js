// when loaded, it automatically load all feature files in specified directory and run all featureSteps tests

(function(){
	var gherkinRunner = require('./gherkin-runner');

	// TODO : extract featureFileBasePath into a config module file
	var featurePath = global.featureFileBasePath || process.cwd();
	console.info('Looking for feature files in ' + featurePath); 
	gherkinRunner.loadFeaturesFiles(featurePath);
	gherkinRunner.api.featureRunner().run();
}());