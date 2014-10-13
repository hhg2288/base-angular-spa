'use strict';
angular.module('app', [
		'ui.router',
		//'ui.bootstrap',

		'app.home'
	])

	.run(function runFn($rootScope){

	})

	.config(function configFn($urlRouterProvider){
		$urlRouterProvider.otherwise('/');
	})
;