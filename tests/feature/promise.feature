Feature: promise
	
	Scenario: Should wait promise result to chain steps
		Given I use Bluebird
		When I have a promise setting 'toto' in context after 250 ms
		And I have a promise setting 'titi' in context after 5 ms
		Then I have 'titi' in context
		
	Scenario: Should wait promise result to chain steps
		Given I use Bluebird
		When I have a promise setting 'fail' in context after 250 ms
		Then I have 'fail' in context
	
		