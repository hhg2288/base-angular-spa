'use strict';
angular.module('app.home', [
		'ui.router'
	])

	.config(function homeConfig($stateProvider){
		$stateProvider
			.state('home', {
				url: '/',
				views: {
					main: {
						templateUrl: 'js/home/home.tpl.html',
						controller: 'HomeCtrl'
					}
				}
			});
	})

	.controller('HomeCtrl', [ '$scope', function($scope){
		$scope.mssg = 'Hello World!';
	}])
;