var gherkin = require('../../lib/gherkin-runner');
var assert = require("assert");

(function(){
	'use strict';
	gherkin.api.featureSteps(/Add support to gherkin's steps parameters/)
		.given(/a blog post named "Random" with Markdown body/, function(docString){
			assert.equal(docString, "Some Title, Eh?\n"+
  "===============\n"+
  "Here is the first paragraph of my blog post. Lorem ipsum dolor sit amet,\n"+
  "consectetur adipiscing elit."); 
		})
        .given(/the following users exist:/, function(tableArg){
            assert.equal(tableArg.length, 3);
        });
        
})();

