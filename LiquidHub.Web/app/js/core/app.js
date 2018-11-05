(function ($, notifier) {
    "use strict";
    var app = angular.module("myApp", [
        /*
          * Order is not important. Angular makes a
          * pass to register all of the modules listed
          * and then when app.dashboard tries to use app.data,
          * it's components are available.
          */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        //'home',
        //'demo'
        'myApp.core',
        /*Feature areas */
        'myApp.home',
        'demo'
        
    ])

})(jQuery, toastr);
