'use strict';
(function () {

var homeCtrl = function($scope){
	$scope.mssg = 'the dashboard will be here';
};

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

	.controller('HomeCtrl', [ '$scope', homeCtrl])
;

})();