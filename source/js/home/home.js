'use strict';
angular.module('mentr.home', [
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

	.controller('HomeCtrl', [ '$scope', 'docsService', function($scope){

	}])
;