(function () {
    'use strict';

    angular.module('myApp.core', [
        /* Angular modules */
        'ngAnimate', 'ui.router', 'ngSanitize',

        /*Our reusable cross app code modules
         * 'blocks.exception',*/
        'myApp.CommonDirectives', 'CommonServices','demoservice',

        /*3rd Party modules */
        'ui.bootstrap'
    ]);
})();
