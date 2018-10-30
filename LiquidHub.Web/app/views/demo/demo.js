(function () {
    'use strict';
    angular.module("demo", ['ngRoute', 'CommonServices', 'myApp.CommonDirectives']);
    //angular.module('demo').config(config);

    //function config($routeProvider) {
        
    //    $routeProvider.when("/Admin",
    //      {
    //          templateUrl: "/Content/views/Admin/demo.html",
    //          controllerAs: 'vm',
    //          controller: 'demoCtlr',

    //      });
    //}
    angular.module('demo').controller('demoCtlr', demoCtlr);
    demoCtlr.$inject = ['$scope', '$q'];

    function demoCtlr($scope, $q) {
        var vm = this;
        vm.message = "Welcome Admin";
    }

})();