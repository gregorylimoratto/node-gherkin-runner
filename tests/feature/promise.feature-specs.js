var gherkin = require('../../lib/gherkin-runner');

(function(){
	'use strict';
	gherkin.api.featureSteps(/promise/)
		.given(/I use Bluebird/, function(){ 
			this.promise = require('bluebird');
		})
		.when(/I have a promise setting '(.*)' in context after (\d+) ms/, function(message, ms){ 
			var defer = this.promise.defer();
			var self = this;
			setTimeout(function(){
				if (message === "fail"){
					//defer.reject({errorMessage: message});
					
					self.message = message;
					defer.resolve();
				} else {
					self.message = message;
					defer.resolve();
				}
			}, ms);
			return defer.promise;
		})
		.then(/I have '(.*)' in context/,function(message){
			var assert = require("assert");
			assert.equal(message, this.message); 
		});
})();

