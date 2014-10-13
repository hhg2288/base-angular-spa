'use strict';
angular.module('mentr', [
		'ui.router',

		'mentr.home'
	])

	.run(function runFn($rootScope){

	})

	.config(function configFn($urlRouterProvider){
		$urlRouterProvider.otherwise('/');
	})
;