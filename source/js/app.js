'use strict';
(function () {

	angular
		.module('app', [
			'ui.router',

			'app-templates',
			'app.home'
		])
		.run(init)
		.config(config)
	;

	function init($rootScope) {

	}

	function config($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}

})();