var gherkin = require('../../lib/gherkin-runner');

(function(){
	'use strict';
	gherkin.api.featureSteps(/promise/)
		.given(/j'ai une promise bleubird/, function(){
			
			this.promise = require('bluebird');
			var defer = this.promise.defer();
			
			setTimeout(function(){
				//defer.reject(new Error("KO"));
				defer.resolve({ errorMessage: "KO", person : { nom : "test"}});
			},1000);
			
			return defer.promise;
		})
		.when(/j'enchaine une autre promise/, function(roman){
			var assert = require("assert");
			assert.equal("TAC", "");
			var result = this.promise.resolve();
			var self = this;
			return  result.then(function(){
				self.result = "TAC";
			});
		})
		.then(/j'ai le resultat/, function(){
			var assert = require("assert");
			assert.equal("TAC", this.result);
		})
})();


function Obj(){
	
}

Obj.prototype.DoQqch = function(){
	this.promise = require('bluebird');
	var defer = this.promise.defer();
	setTimeout(function(){
		defer.resolve("OK");
	},1000);
	
	return defer.promise;
}