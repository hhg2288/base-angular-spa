'use strict';
(function () {

	angular
		.module('app.home', [])


		.config(function homeConfig($stateProvider){
			$stateProvider
				.state('home', {
					url: '/',
					views: {
						main: {
							templateUrl: 'source/js/home/home.tpl.html',
							controller: 'HomeCtrl',
							controllerAs: 'vm'
						}
					}
				});
		})
		.controller('HomeCtrl', HomeCtrl);

		HomeCtrl.$inject = [];

		/* @ngInject */
		function HomeCtrl() {

			/* jshint validthis: true */
			var vm = this;

			vm.mssg = 'Home View';

		}


})();