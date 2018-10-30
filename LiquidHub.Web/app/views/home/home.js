(function () {
    'use strict';
    angular.module("myApp.home", []);
    angular.module('myApp.home').controller('homeCtlr', homeCtlr);
    homeCtlr.$inject = ['$scope', '$q', 'config'];

    function homeCtlr($scope, $q, config) {
        var vm = this;
        vm.baseURL = config.baseURL;
        vm.message = "Welcome to Home";
    }

})();