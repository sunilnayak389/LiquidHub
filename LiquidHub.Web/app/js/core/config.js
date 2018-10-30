(function ($, notifier) {
    'use strict';

    var core = angular.module('myApp.core');

    //core.config(toastrConfig);

    //toastrConfig.$inject = ['toastr']
    //function toastrConfig(toastr) {
    //    toastr.options.timeOut = 4000;
    //    toastr.options.positionClass = 'toast-center';
    //}

    //core.config(loadingBarConfig);

    //loadingBarConfig.$inject = ['cfpLoadingBarProvider']
    //function loadingBarConfig(cfpLoadingBarProvider) {
    //    cfpLoadingBarProvider.includeSpinner = true;
    //    cfpLoadingBarProvider.includeBar = true;
    //}

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Foodisha',
        version: '1.0.0',
        baseURL: '/'


     
    };
    core.value('config', config);

    core.run(rootscope);

    rootscope.$inject = ['$rootScope', '$state', '$stateParams'];

    function rootscope($rootScope, $state, $stateParams) {
        $state.previous = null;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            $state.previous = fromState;
        });
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.datePickerOptions = { // pass jQueryUI DatePicker options through
            changeYear: false,
            changeMonth: false,
            dateFormat: 'dd/mm/yy'
        }
        $rootScope.outputDateFormat = 'yy/mm/dd'; // whenever 
    }

    core.config(routconfig);


    routconfig.$inject = ['$stateProvider', '$urlRouterProvider', '$provide', '$locationProvider'];

    function routconfig($stateProvider, $urlRouterProvider, $provide, $locationProvider) {
        debugger;

        


        $urlRouterProvider
       // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
       .otherwise('/');

        if (window.history && window.history.pushState) {
            // Remove hashtag (#) from the routes
            $locationProvider.html5Mode(true);
        }
        $provide.provider("LibService", function () {
            notifier.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };



            $.blockUI.defaults.css = {};

            return {
                $get: function () {
                    return {
                        notifier: notifier,

                        blocker: {
                            block: function () {
                                $.blockUI({ message: '<img src="content/css/images/ajax-loader.gif" /> loading...' });
                            },

                            unblock: function () {
                                $.unblockUI();
                            }
                        }
                    }
                }
            };
        });
        // Use $stateProvider to configure your states.
        $urlRouterProvider.rule(function ($injector, $location) {
            //what this function returns will be set as the $location.url
            var path = $location.path(), normalized = path.toLowerCase();
            if (path != normalized) {
                //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
                $location.replace().path(normalized);
            }
        });

        $stateProvider

          .state("home", {
              url: "/",
              templateUrl: config.baseURL + 'app/views/home/home.html',
              controller: "homeCtlr as vm"
            })
            .state("demo", {
                url: "/demo",
                templateUrl: config.baseURL + 'app/views/demo/demo.html',
                controller: "demoCtlr as vm"
            })
         //.state("employee", {
         //    url: "/employee/:empId",
         //    templateUrl: config.baseURL + 'employee/Index',
         //    controller: "EmployeeShellCtrl as vm"
         //})
         //    .state("employee.general", {
         //        url: "/general",
         //        templateUrl: config.baseURL + 'employee/AddEmployee',
         //        controller: "employeeGeneralCtrl as vm"
         //    })
         

    }

})(jQuery, toastr);
