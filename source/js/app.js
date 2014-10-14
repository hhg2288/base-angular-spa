'use strict';
(function () {

	var init = function($rootScope){

		},

		config = function($urlRouterProvider){
			$urlRouterProvider.otherwise('/');
		};



angular
	.module('app', [
		'ui.router',
		'ui.bootstrap',

		'app.home'
	])
	.run(init)
	.config(config)
;

})();