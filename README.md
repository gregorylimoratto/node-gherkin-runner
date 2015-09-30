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
	var gherkin = require('node-gherkin-runner');
	gherkin.api.featureSteps(/Calculator/)
		.given(/I have entered (.*) into the calculator/, function(num){
			// this step is for each feature that contains Calculator in title 
		});

	gherkin.api.featureSteps('Calculator addition')
		.when('I press add', function(){
			// this one is not shared for "Calculator substraction"
		});
```

given/when/then step can be string or regular expression that match a step in the feature file.

```javascript
	var gherkin = require('node-gherkin-runner');
	gherkin.api.featureSteps(/Addition/)
		.given(/I have entered (.*) into the calculator/, function(num){
			this.numbers = this.numbers || [];
			this.numbers.push(parseInt(num));
		})
		.when('I press add', function(){
			this.result = this.numbers.reduce(function(a,b){ return a + b },0);
		})
		.then(/the result should be (\d+) on the screen/, function(expectedSum){
			expect(this.result).toBe(parseInt(expectedSum));
		})
		.then('failed the test', function(){
			expect(true).toBe(false);
		});
```

Each step is executed on an isolated scope (*this*) which can hold current scenario state. (reset for each scenario)

You can add test initialize and cleanup :

```javascript
	var gherkin = require('node-gherkin-runner');
	gherkin.api.featureSteps('Addition')
	 	.before(function () {
			...
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

Using protractor :

demo.feature: 

	Feature: angularjs homepage

	Background:
		Given I browse angular website
		
	Scenario: Must greet the user
	
		Given I insert 'Greg' in the "yourName" field
		When I look at the greeting message
		Then I see 'Hello Greg!'
	
	Scenario: Must display a pre-set todo list
		
		Given The todo list is displayed by default with 2 elements
		When I look at the todo elements
		Then There is 2 elements in todo list
		And The text for the number 2 is 'build an angular app'
	
	Scenario: Must add a todo when Add button is click
	
		Given The todo list is displayed by default with 2 elements
		When I insert 'write a protractor test using gherkin' in the input field
		And I click on Add button
		And I look at the todo elements
		Then There is 3 elements in todo list
		And The text for the number 3 is 'write a protractor test using gherkin'

demo.feature-specs.js

```javascript
	var gherkin = require('node-gherkin-runner');

(function(){
	'use strict';
	gherkin.api.featureSteps(/angularjs homepage/)
		.given(/I browse angular website/, function(){
			browser.get('http://www.angularjs.org');
		})
		.given(/I insert '(.*)' in the "yourName" field/, function(nom){
			element(by.model('yourName')).sendKeys(nom);
		})
		.when(/I look at the greeting message/, function(){
			 this.message = element(by.binding('yourName'));
		})
		.then(/I see '(.*)'/, function(message){
			expect(this.message.getText()).toEqual(message);
		})
		.given(/The todo list is displayed by default with 2 elements/, function(){
			// nothing to do
		})
		.when(/I look at the todo elements/, function(){
			this.todos = element.all(by.repeater('todo in todoList.todos'));
		})
		.then(/There is (\d+) elements in todo list/,function(nombre){
			expect(this.todos.count()).toEqual(parseInt(nombre));
		})
		.then(/The text for the number (\d+) is '(.*)'/, function(numero, text){
			expect(this.todos.get(numero-1).getText()).toEqual(text);
		})
		.when(/I insert '(.*)' in the input field/, function(text){
			var addTodo = element(by.model('todoList.todoText'));
			addTodo.sendKeys(text);
		})
		.when(/I click on Add button/, function(){
			var addButton = element(by.css('[value="add"]'));
      		addButton.click();
		})
})();
```

e2e.config (protractor) : 
```javascript
var gherkinRunnerPath = require('node-gherkin-runner').runnerPath;
gherkinRunnerPath = gherkinRunnerPath.replace(__dirname+'\\', '');
console.log(gherkinRunnerPath);
exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec/demo.feature-specs.js', gherkinRunnerPath]
}
```

----