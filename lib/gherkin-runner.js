/* global process */
(function(){
	'use strict';
	var IGNORE_TAG = "@ignore";
	var IGNORE_OTHER_TAG = "@ignoreOthers";
	
	var gherkinSpecApi = require('gherkin-specs-api');
	var gherkin = require('gherkin');
	var glob = require('glob');
	var fs = require('fs');
	
	function hasTag(tags, tagName) {
		return tags.some(function (tag) { return tag.name === tagName });
	}
	
	function loadFeaturesFiles(baseDir) {
		var files = glob.sync(baseDir + "/**/*.feature");
		files.forEach(function (file) {
			var fileContent = fs.readFileSync(file, 'utf8');
			var parser = new gherkin.Parser();
			var feature = parser.parse(fileContent);
			describeFeature(feature);
		});
	}
	
	function describeFeature(feature) {
		var featureSpec = gherkinSpecApi.feature(feature.name);
	
		if(hasTag(feature.tags, IGNORE_OTHER_TAG)){
			featureSpec.ignoreOthers();
		}
		if (hasTag(feature.tags, IGNORE_TAG)) {
			featureSpec.ignore();
		}
		
		feature.scenarioDefinitions.forEach(function (scenario) {
			describeScenario(scenario, featureSpec, feature.background);
		});
	}
	
	function describeScenario(scenario, featureSpec, background) {
		if (scenario.examples) {
			scenario.examples[0].tableBody.forEach(function (example) {
				var scenarioSpec = featureSpec.scenario(scenario.name);
				
				if(hasTag(scenario.tags, IGNORE_OTHER_TAG)){
					scenarioSpec.ignoreOthers();
				}
				if (hasTag(scenario.tags, IGNORE_TAG)) {
					scenarioSpec.ignore();
				}
				
				var cloneSteps = JSON.parse(JSON.stringify(scenario.steps));
				var header = scenario.examples[0].tableHeader;
	
				cloneSteps.forEach(function (step) {
					generateExample(header, example, step);
				});
	
				if (background && background.steps) {
					cloneSteps = background.steps.concat(cloneSteps); // slice c'est bien aussi
				}
				cloneSteps.forEach(function (step) {
					describeStep(step, scenarioSpec);
				});
	
			});
		} else {
			var scenarioSpec = featureSpec.scenario(scenario.name);
			
			if(hasTag(scenario.tags, IGNORE_OTHER_TAG)){
				scenarioSpec.ignoreOthers();
			}
			if (hasTag(scenario.tags, IGNORE_TAG)) {
				scenarioSpec.ignore();
			}
			
			var steps = scenario.steps;
			if (background && background.steps) {
				steps = background.steps.concat(scenario.steps);
			}
	
			steps.forEach(function (step) {
				describeStep(step, scenarioSpec);
			});
		}
	}
	
	function generateExample(header, example, step) {
		for (var i = 0; i < example.cells.length; i++) {
			var paramName = header.cells[i].value;
			var value = example.cells[i].value;
			var re = new RegExp("<" + paramName + ">", "g");
			step.text = step.text.replace(re, value);
		}
	}
	
	var previousKeyword;
	function describeStep(step, scenarioSpec) {
		var keyword = step.keyword.toLowerCase().trim();
		switch (keyword) {
			case "given":
			case "when":
			case "then":
				previousKeyword = keyword;
				break;
			default:
				// And / But / ...
				keyword = "and";
		}
	
		var tableArgObj = createTableArgumentsObj(step);
		if (tableArgObj !== null) {
			scenarioSpec[keyword](sanitizeString(step.text), tableArgObj);
		} else {
			scenarioSpec[keyword](sanitizeString(step.text));
		}
	}
	
	function createTableArgumentsObj(step) {
		if (step.argument && step.argument.rows.length > 0) {
			var tableArg = [];
			var properties = [];
			step.argument.rows[0].cells.forEach(function (cell) {
				properties.push(cell.value);
			})
	
			for (var j = 1; j < step.argument.rows.length; j++) {
				var row = step.argument.rows[j];
				var argument = {};
				for (var k = 0; k < row.cells.length; k++) {
					argument[properties[k]] = row.cells[k].value;
				}
				tableArg.push(argument);
			}
			return tableArg;
		}
		return null;
	}
	
	function sanitizeString(str) {
		return str.replace(/'/g, '\'').replace(/[\ \t]*[\n\r]+[\ \t]*/g, "\\n\\r' + \n\r\t'");
	}

	module.exports = {
		runnerPath: __dirname + "/runner.js",
		api: gherkinSpecApi,
		loadFeaturesFiles: loadFeaturesFiles
	}
})();