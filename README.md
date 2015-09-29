# node-gherkin-runner

Node module that transforme feature files into full javascript (using [https://github.com/gregorylimoratto/gherkin-specs-api.git](https://github.com/gregorylimoratto/gherkin-specs-api.git) 
and run then using mocha, jasmine-node or protractor

Any feedback is appreciated ! 

## Usage

### Install

node-gherkin-runner is available as an npm module

Install locally with

	npm install node-gherkin-runner --save-dev


### Features

The examples are written with Gherkin language : [https://github.com/cucumber/cucumber/wiki/Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin)

	Feature: Calculator addition 
		In order to avoid silly mistakes
		As a math idiot
		I want to be told the sum of two numbers
	
		Scenario: Add two numbers
			Given I have entered 50 into the calculator
			And I have entered 70 into the calculator
			When I press add
			Then the result should be 120 on the screen

		@ignore
		Scenario: Add two other numbers
			Given I have entered 10 into the calculator
			And I have entered 79 into the calculator
			When I press add
			Then the result should be 89 on the screen
			And failed the test


Each Gherkin ***Feature*** will become a jasmine/mocha/protractor ***describe***

And each ***Scenario*** will become a ***it***

Some tags will allow you to ignore feature execution : jasmine/mocha/protractor xdescribe() / xit()

- @ignore - ignore Feature or Scenario
- @ignoreOthers - ignore all other feature / scenario exept those with this tag

### Javascript Specs

The module will look for feature files (gherkin) in `process.cwd()` and all subdirectories.

The featureSteps() function host a set of steps that will be available for each feature that match the featureSteps regexp

```javascript
	featureSteps(/Calculator/)
		.given(/I have entered (.*) into the calculator/, function(num){
			// this step is for each feature that contains Calculator in title 
		});

	featureSteps('Calculator addition')
		.when('I press add', function(){
			// this one is not shared for "Calculator substraction"
		});
```

given/when/then step can be string or regular expression that match a step in the feature file.

```javascript
	featureSteps(/Addition/)
		.given(/I have entered (.*) into the calculator/, function(num){
			this.numbers = this.numbers || [];
			this.numbers.push(parseInt(num));
		})
		.when('I press add', function(){
			this.result = this.numbers.reduce(function(a,b){ return a + b },0);
		})
		.then(/the result should be (.*) on the screen/, function(expectedSum){
			expect(this.result).toBe(parseInt(expectedSum));
		})
		.then('failed the test', function(){
			expect(true).toBe(false);
		});
```

Each step is executed on an isolated scope (*this*) which can hold current scenario state. (reset for each scenario)

You can add test initialize and cleanup :

```javascript
	featureSteps('Addition')
	 	.before(function () {
			module('calculator'); // angular ng mock
			var scope = null;
			inject(function (_$injector_) {
				scope = _$injector_.get('$rootScope').$new();
			}); 
	       	this.scope = scope;
	    })
		.after(function(){
			...
		})
	...
```

To install :

	npm install node-gherkin-runner --save-dev


And just include the module as a file to test in your test runner

Example gruntfile using mocha (and grunt-mocha-test) :
```
	mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests/**/*.js', 'node_module/node-gherkin-runner/lib/gherkin-runner.js']
      }
    }
```


#### Examples


demo.feature: 

	Feature: Roman numerals

	Background: 
		Given I have a Roman numerals calculator
		
	Scenario Outline: The calculator should transform simple roman numeral to number     
	    Given I enter '<roman>' in the calculator
	     When I convert the roman numeral
	     Then the displayed value is '<number>'
		 
	    Examples:
		| roman | number |
		|     I |      1 |
		|     V |      5 |
		|     X |     10 |
		|     L |     50 |
		|     C |    100 |
		
	Scenario: Should add two complex roman numerals
		Given I enter 'IX' in the calculator
		And I enter 'III' in the calculator
		When I press add
		Then the displayed value is 'XII'
	
	@ignore
	Scenario: Should be ignore
		Given A scenario with no js implementation
		When I include this scenario
		Then Nothing happens

demo.feature-specs.js

```javascript
	(function(){
	'use strict';
		featureSteps(/Roman numerals/)
			.given(/I have a Roman numerals calculator/, function(){
				this.calculator = new Calculator();
			})
			.given(/I enter '(.*)' in the calculator/, function(roman){
				this.calculator.setInput(roman);
			})
			.when(/I convert the roman numeral/, function(){
				this.calculator.convert();
			})
			.when(/I press add/, function(){
				this.calculator.add();
			})
			.then(/the displayed value is '(.*)'/, function(num){
				expect(this.calculator.getDisplayedValue()).toBe(num);
			});
	})();
```

----