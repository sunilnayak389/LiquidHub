(function (angular, $) {
    'use strict';
    angular.module('psxdatetimepicker', []).run([
        '$templateCache', function ($templateCache) {
            'use strict';

            $templateCache.put('template/date-picker.html',
                "<ul ng-if=\"isOpen && showPicker == 'date'\" class=\"dropdown-menu dropdown-menu-left datetime-picker-dropdown\" ng-style=dropdownStyle style=z-index:2000; left:inherit ng-keydown=keydown($event) ng-click=$event.stopPropagation()><li style=\"padding:0 5px 5px 5px\" class=date-picker-menu><div ng-transclude></div></li><li ng-if=showButtonBar style=padding:5px><span class=\"btn-group pull-left\" style=margin-right:6px><button type=button class=\"btn btn-sm btn-info\" ng-click=\"select('today')\" ng-disabled=\"isDisabled('today')\">{{ getText('today') }}</button> <button type=button class=\"btn btn-sm btn-danger\" ng-click=select(null)>{{ getText('clear') }}</button></span> <span class=\"btn-group pull-right\"><button ng-if=enableTime type=button class=\"btn btn-sm btn-default\" ng-click=\"changePicker($event, 'time')\">{{ getText('time')}}</button> </span></li></ul>"
            );


            $templateCache.put('template/time-picker.html',
                "<ul ng-if=\"isOpen && showPicker == 'time'\" class=\"dropdown-menu dropdown-menu-left datetime-picker-dropdown\" ng-style=dropdownStyle style=left:inherit ng-keydown=keydown($event) ng-click=$event.stopPropagation()><li style=\"padding:0 5px 5px 5px\" class=time-picker-menu><div ng-transclude></div></li><li ng-if=showButtonBar style=padding:5px><span class=\"btn-group pull-left\" style=margin-right:6px><button type=button class=\"btn btn-sm btn-info\" ng-click=\"select('now')\" ng-disabled=\"isDisabled('now')\">{{ getText('now') }}</button> <button type=button class=\"btn btn-sm btn-danger\" ng-click=select(null)>{{ getText('clear') }}</button></span> <span class=\"btn-group pull-right\"><button ng-if=enableDate type=button class=\"btn btn-sm btn-default\" ng-click=\"changePicker($event, 'date')\">{{ getText('date')}}</button> <button type=button class=\"btn btn-sm btn-success\" ng-click=close()>{{ getText('close') }}</button></span></li></ul>"
            );
        }
    ]);
    angular.module('myApp.CommonDirectives', []).
        directive('csMenu', [
            '$location', function ($location) {


                return {
                    scope: {},

                    restrict: 'A',

                    link: function (scope, elem, attrs) {

                        scope.$on('$locationChangeSuccess', function () {

                            var navLink = elem.attr('href');

                            if ('#' + $location.path() === navLink) {
                                elem.parent().attr('class', 'active');
                                //elem.parents('li.dropdown').attr('class', 'active');
                            } else {
                                elem.parent().attr('class', '');
                                //elem.parent().siblings().attr('class', '');
                            }
                        });
                    }
                };
            }
        ]).
        directive('ngFloatRange', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var floatRegexp = /^[0-9]+(\.[0-9]{1,2})?$/;
                        var min = parseInt(attrs.min);
                        var max = parseInt(attrs.max);
                        if (floatRegexp.test(viewValue) && viewValue >= min && viewValue <= max) {
                            ctrl.$setValidity('float', true);
                            return parseFloat(viewValue.replace(',', '.'));
                        } else {
                            ctrl.$setValidity('float', false);
                            return undefined;
                        }
                    });
                    var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 189, 190];
                    elm.bind("keydown", function (event) {
                        if ($.inArray(event.which, keyCode) === -1) {
                            scope.$apply(function () {
                                scope.$eval(attrs.onlyNum);
                                event.preventDefault();
                            });
                            event.preventDefault();
                        }

                    });
                }
            };
        }).
        directive('ngNumber', ['$filter', '$locale', function ($filter, $locale) {
            return {
                require: 'ngModel',
                scope: {
                    commasOn: '=',
                    ngRequired: '=ngRequired'
                },
                link: function (scope, element, attrs, ngModel) {
                    if (scope.commasOn) {

                        function decimalRex(dChar) {
                            return RegExp("\\d|\\-|\\" + dChar, 'g');
                        }

                        function clearRex(dChar) {
                            return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0,2}", 'g');
                        }

                        function clearValue(value) {
                            value = String(value);
                            var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                            var cleared = null;

                            if (RegExp("^-[\\s]*$", 'g').test(value)) {
                                value = "-0";
                            }

                            if (decimalRex(dSeparator).test(value)) {
                                cleared = value.match(decimalRex(dSeparator))
                                    .join("").match(clearRex(dSeparator));
                                cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                            } else {
                                cleared = null;
                            }

                            return cleared;
                        }

                        ngModel.$parsers.push(function (viewValue) {
                            var cVal = clearValue(viewValue);
                            return parseFloat(cVal);
                        });

                        element.on("blur", function () {

                            var itemValue = ngModel.$modelValue;

                            if (ngModel.$modelValue !== 0 && ngModel.$modelValue !== null) {
                                itemValue = $filter('number')(itemValue, 0);
                            }

                            element.val(itemValue);
                        });

                        element.on("keydown", function () {

                            var allowedSpecialCharKeyCodes = [46, 8, 37, 39, 35, 36, 9];
                            var numberKeyCodes = [44, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
                            var commaKeyCode = [188];

                            var legalKeyCode =
                                (!event.shiftKey && !event.ctrlKey && !event.altKey)
                                    &&
                                    (jQuery.inArray(event.keyCode, allowedSpecialCharKeyCodes) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, numberKeyCodes) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, commaKeyCode) >= 0);

                            // Allow for $
                            if (!legalKeyCode && event.shiftKey && event.keyCode === 52)
                                legalKeyCode = true;

                            if (legalKeyCode === false)
                                event.preventDefault();

                        });

                    } else {
                        var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 188];
                        element.bind("keydown", function (event) {
                            if ($.inArray(event.which, keyCode) === -1) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.onlyNum);
                                    event.preventDefault();
                                });
                                event.preventDefault();
                            }

                        });

                    }
                }
            };
        }]).

        directive('ngCalendar', function () {
            return function (scope, element, attrs) {

                var keyCode = [8, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 111, 191];
                element.bind("keydown", function (event) {
                    if ($.inArray(event.which, keyCode) === -1) {
                        scope.$apply(function () {
                            scope.$eval(attrs.onlyNum);
                            event.preventDefault();
                        });
                        event.preventDefault();
                    }

                });
            };
        }).


            directive('ngDecimal', function () {
                return function (scope, element, attrs) {

                    var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 188, 189, 190];
                    element.bind("keydown", function (event) {
                        if ($.inArray(event.which, keyCode) === -1) {
                            scope.$apply(function () {
                                scope.$eval(attrs.onlyNum);
                                event.preventDefault();
                            });
                            event.preventDefault();
                        }

                    });
                };
            }).


        directive('csHeaderTemplate', function () {

            return {
                transclude: true,

                scope: {},

                restrict: 'E',

                require: '^csGrid',

                link: {
                    post: function (scope, elem, attrs) {

                        //scope.addHeader = controllerInstance.addHeader;
                    }
                }
            };
        }).
        directive('csColumns', function () {

            return {
                transclude: true,

                scope: {},

                restrict: 'E',

                require: '^csGrid',

                template: '<div ng-transclude></div>',

                priority: 400,

                controller: ['$scope', function ($scope) {
                    this.addHeader = function (header) {

                        $scope.addHeader(header);

                    };
                }],

                link: {
                    pre: function (scope, elem, attrs, controllerInstance) {

                        scope.addHeader = controllerInstance.addHeader;
                    }
                }
            };
        }).
        directive('csUserValidation', [
            '$filter', '$timeout', function ($filter, $timeout) {

                return {
                    transclude: true,
                    restrict: 'E',

                    scope: {
                        formName: '=',
                        controlName: '@'
                    },

                    templateUrl: './Content/Views/Templates/UserValidation.html?v=' + new Date().getMilliseconds(),

                    link: function (scope, elem, attrs) {

                    }
                };
            }
        ]).
        directive('csColumn', function () {

            return {
                transclude: true,

                scope: {
                    columnDescription: '@',
                    columnSource: '@',
                    columnType: '@',
                    selectSource: '=',
                    trueValue: '@',
                    falseValue: '@',
                    allowSort: '=',
                    allowFilter: '=',
                    allowSearch: '=',
                    allowEdit: '=',
                    alwaysEdit: '=',
                    isLookup: '=',
                    isIcon: '=',
                    isRequired: '=',
                    lookupCallback: '&',
                    width: '@',
                    valueField: '@',
                    displayField: '@',
                    dateFormat: '@',
                    editDisabled: '='
                },

                priority: 500,

                restrict: 'E',

                require: '^csColumns',

                link: {
                    post: function (scope, elem, attrs, controllerInstance) {

                        controllerInstance.addHeader({
                            Source: scope.columnSource,
                            Description: scope.columnDescription,
                            ColumnType: scope.columnType,
                            SelectSource: scope.selectSource,
                            TrueValue: scope.trueValue,
                            FalseValue: scope.falseValue,
                            AllowSort: scope.allowSort,
                            AllowFilter: scope.allowFilter,
                            AllowSearch: scope.allowSearch,
                            AllowEdit: scope.allowEdit,
                            AlwaysEdit: scope.alwaysEdit,
                            IsLookup: scope.isLookup,
                            IsIcon: scope.isIcon,
                            IsRequired: scope.isRequired,
                            LookupCallback: scope.lookupCallback,
                            Width: scope.width,
                            ValueField: scope.valueField,
                            DisplayField: scope.displayField,
                            DateFormat: scope.dateFormat,
                            EditDisabled: scope.editDisabled,
                            ColFilter: ''
                        });
                    }
                }
            };
        }).
        directive('csDraggable', [
            '$filter', '$timeout', function ($filter, $timeout) {

                return {
                    transclude: true,
                    restrict: 'A',

                    require: '^csGrid',

                    scope: {
                        sourceField: '='
                    },

                    link: function (scope, elem, attrs) {

                        $(elem).on('mousedown', function (e) {

                            // Stop default so text does not get selected
                            e.preventDefault();
                            e.originalEvent.preventDefault();

                            // init variable for new width
                            var new_width;

                            // store initial mouse position
                            //console.log(e.pageX);
                            var initial_x = e.pageX;

                            // create marquee element
                            var $m = $('<div class="resize-marquee"></div>');

                            // append to th
                            var $th = $(this).parent('th');
                            $th.append($m);

                            // set initial marquee dimensions
                            var initial_width = $th.width();
                            $m.css({
                                width: initial_width + 'px',
                                height: $th.height() + 'px'
                            });

                            // set mousemove listener
                            $(window).on('mousemove', mousemove);

                            // set mouseup/mouseout listeners
                            $(window).one('mouseup', function () {
                                // remove marquee, remove window mousemove listener
                                $m.remove();
                                $(window).off('mousemove', mousemove);

                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.sourceField.Width = new_width + 'px';
                                    });
                                });
                            });

                            function mousemove(e) {
                                // calculate changed width
                                var current_x = e.pageX;
                                var diff = current_x - initial_x;
                                new_width = initial_width + diff;

                                // update marquee dimensions
                                $m.css('width', new_width + 'px');
                                // set new width on th
                                $th.css('width', new_width + 'px');
                                //console.log('moving:', diff);
                            }
                        });
                    }
                };
            }
        ]).
        directive('csGrid', [
            '$timeout', '$location', '$filter', 'csGridService', function ($timeout, $location, $filter, csGridService) {
                return {
                    restrict: 'E',

                    transclude: true,

                    scope: {
                        gridSource: '=',
                        showEdit: '=',
                        showDelete: '=',
                        showCreate: '=',
                        autoColumns: '=',
                        hidePaging: '=',
                        hideSearch: '=',
                        formName: '=',
                        deleteDisplayField: '@',
                        pagerLength: '@',
                        initialPageSize: '=',
                        keyField: '@',
                        gridTitle: '@',
                        rowClicked: '&',
                        onEdit: '&',
                        onSave: '&',
                        onDelete: '&',
                        onCreate: '&',
                        onCancel: '&',
                        noDatabase: '='
                    },

                    templateUrl: './Content/Views/Templates/CsDataGrid.html?v=' + new Date().getMilliseconds(),

                    controller: ['$scope', function ($scope) {

                        //if ($scope.hidePaging)

                        $scope.colFilterArray = [];

                        $scope.headers = [];
                        var filter = $filter('filter');

                        this.addHeader = function (header) {

                            $scope.headers.push(header);
                        };

                        csGridService.subscribeColumnData($scope, function (data) {

                            $.each($scope.headers, function (index, obj) {

                                if (obj.Source === data.column) {
                                    obj.SelectSource = data.data;
                                }
                            });

                        });




                        this.filterColumn = function (filterText, header) {


                            // Perform search on the text entered.
                            $scope.filteredSource = filter($scope.gridSource, function (value, index) {

                                var returnValue = true;

                                if (filterText) {

                                    var flag = false;

                                    for (var arrIndex = 0; arrIndex < $scope.colFilterArray.length; arrIndex++) {

                                        if ($scope.colFilterArray[arrIndex].ColumnSource.Source === header.Source) {

                                            $scope.colFilterArray[arrIndex].Value = filterText;

                                            flag = true;

                                            break;
                                        }
                                    }

                                    if (!flag) {
                                        $scope.colFilterArray.push({ ColumnSource: header, Value: filterText });
                                    }

                                    $.each($scope.colFilterArray, function (index, obj) {

                                        if (obj.ColumnSource.AllowSearch) {
                                            var pattern = new RegExp(obj.Value, "i");

                                            returnValue = returnValue && pattern.test(value[obj.ColumnSource.Source]);
                                        }
                                    });

                                } else {

                                    for (var arrIndex1 = 0; arrIndex1 < $scope.colFilterArray.length; arrIndex1++) {

                                        if ($scope.colFilterArray[arrIndex1].ColumnSource.Source === header.Source) {

                                            $scope.colFilterArray.splice(arrIndex1, 1);

                                            break;
                                        }
                                    }

                                    $.each($scope.colFilterArray, function (index, obj) {

                                        if (obj.ColumnSource.AllowSearch) {
                                            var pattern = new RegExp(obj.Value, "i");

                                            returnValue = returnValue && pattern.test(value[obj.ColumnSource.Source]);
                                        }
                                    });

                                }

                                return returnValue;
                            });

                            $scope.calculatePageCount();

                            $scope.SetCurrentPageData();
                        };
                    }],

                    link: function (scope, element, attrs) {

                        // Default Page Size
                        scope.pageSize = scope.initialPageSize || 10;
                        // Records Per Page.
                        scope.rpp = scope.pagerLength || 10;
                        // Page sizes.
                        scope.pageSizes = [{ id: 10, value: 10 }, { id: 20, value: 20 }];


                        scope.pages = [];
                        scope.currentPageData = [];
                        scope.searchtxt = '';
                        scope.currentPage = 1;


                        var deleteConfirmationDialog = $($(element).children('.cs-dg-modal'));
                        var btnDeleteConfirm = deleteConfirmationDialog.find('button.delete');
                        var btnCancelDeleteConfirm = deleteConfirmationDialog.find('button.cancel');

                        var flag = true;

                        scope.filteredSource = [];

                        var orderBy = $filter('orderBy');
                        var filter = $filter('filter');

                        var gridSourceOriginal = [];

                        scope.calculatePageCount = function () {

                            var currPageIndex = 0;

                            if (scope.filteredSource !== undefined) {
                                scope.pageSizes = [{ id: 5, value: 5 }, { id: 10, value: 10 }, { id: 20, value: 20 }, { id: 100, value: 100 }, { id: 250, value: 250 }, { id: 500, value: 500 }];
                            }
                            else {
                                scope.pageSizes = [{ id: 5, value: 5 }, { id: 10, value: 10 }, { id: 20, value: 20 }, { id: 100, value: 100 }, { id: 250, value: 250 }, { id: 500, value: 500 }];
                            }

                            // Check if a page is already selected.
                            if (scope.pages.length > 0) {

                                $.each(scope.pages, function (index, obj) {
                                    if (obj.status) {
                                        currPageIndex = index;
                                    }
                                });
                            }

                            scope.pages = [];

                            currPageIndex = 0;
                            if (scope.filteredSource !== undefined && currPageIndex > scope.filteredSource.length - 1) {
                                currPageIndex = scope.filteredSource.length - 1 < 0 ? 0 : scope.filteredSource.length - 1;
                            }


                            // Calculate the total pages.
                            if (scope.filteredSource !== undefined) {
                                for (var index = 0; index < scope.filteredSource.length / scope.pageSize; index++) {
                                    scope.pages.push({ page: index + 1, status: (currPageIndex === index ? 'active' : null) });
                                }
                            }


                            // Check if the last page was selected which needs to be removed as a result of deletion.  
                            // Set the last page active instead in the new collection.
                            if (scope.pages && currPageIndex === scope.pages.length && scope.pages.length > 0) {
                                scope.pages[scope.pages.length - 1].status = 'active';
                            }
                        };

                        // If columns have been provided, then include only those columns on the grid.
                        // Else, read through all the columns in the data source and render
                        if (scope.autoColumns) {
                            for (var key in scope.gridSource[0]) {
                                scope.headers.push({ Source: key, Description: key });
                            }
                        }

                        // Performs a callback to the associated row-click handler on the controller whenever a row on the grid has been clicked.
                        scope.gridRowClick = function (item) {

                            //// First make the row highlighted.
                            //$.each(scope.gridSource, function (index, item) {

                            //    item.selectedRow = '';
                            //    item.fontWeight = '';
                            //});

                            //item.selectedRow = '#f5f5f5';
                            //item.fontWeight = 'bold';

                            // Invoke the row clicked delegate if it has been defined.
                            // Pass the data that has been bound to the grid's row.
                            if (scope.rowClicked) {
                                scope.rowClicked({ item: item });
                            }
                        };

                        // Function to sort the grid.
                        scope.Order = function (predicate, reverse) {

                            if (predicate.AllowSort) {
                                scope.filteredSource = orderBy(scope.filteredSource, predicate.Source, reverse);

                                scope.SetCurrentPageData();

                                $.each(scope.headers, function (index, obj) {
                                    obj.IsColumnSorted = false;
                                });

                                predicate.IsColumnSorted = true;
                            }
                        };

                        // Perform search on the text entered.
                        scope.$watch('searchtxt', function (newValue, oldValue) {

                            scope.filteredSource = filter(scope.gridSource, function (value, index) {

                                var returnValue = true;

                                if (newValue) {

                                    returnValue = false;

                                    var pattern = new RegExp(newValue, "i");

                                    $.each(scope.headers, function (index, obj) {

                                        if (obj.AllowSearch) {
                                            returnValue = returnValue || pattern.test(value[obj.Source]);
                                        }
                                    });
                                }

                                return returnValue;
                            });

                            scope.calculatePageCount();

                            scope.SetCurrentPageData();
                        });

                        scope.SetCurrentPageData = function () {

                            scope.currentPageData = [];

                            $.each(scope.pages, function (index, item) {

                                if (item.status) {

                                    // Get the start position.
                                    scope.startIndex = scope.pageSize * index;

                                    scope.currentPageData = scope.filteredSource.slice(scope.startIndex, scope.startIndex + scope.pageSize);

                                    // First make the row highlighted.
                                    $.each(scope.currentPageData, function (data) {

                                        if (scope.currentPageData[data].IsSubTotal) {
                                            scope.currentPageData[data].selectedRow = '#f5f5f5';
                                            scope.currentPageData[data].fontWeight = 'bold';
                                        }
                                    });

                                }
                            });
                        };

                        scope.OnCreate = function () {

                            if (scope.currentPageData.length > 0 && scope.currentPageData[0].isNewItem) {
                                return;
                            }

                            var item = { isEditMode: true, isNewItem: true, gridActive: true };

                            $.each(scope.headers, function (index, obj) {

                                item[obj.Source] = null;
                            });

                            scope.currentPageData.splice(0, 0, item);

                            if (scope.noDatabase) {
                                if (scope.onCreate && angular.isFunction(scope.onCreate)) {
                                    scope.onCreate({ item: item });
                                }
                            }
                        };

                        scope.OnEdit = function (item, $event) {

                            // Stop the click event from bubbling up to the row click event.
                            $event.stopPropagation();

                            if (scope.noDatabase) {
                                if (scope.onCreate && angular.isFunction(scope.onCreate)) {
                                    item.gridActive = true;
                                    scope.onCreate({ item: item });
                                }
                            }

                            if (!attrs.onEdit) {
                                // Reset isEditMode for all other rows.
                                $.each(scope.filteredSource, function (index, obj) {
                                    obj.isEditMode = false;
                                });

                                item.isEditMode = true;
                            } else {
                                if (angular.isFunction(scope.onEdit)) {
                                    //$location.path(scope.editUrl + '/' + item[scope.keyField]);
                                    scope.onEdit({ item: item });
                                }
                            }
                        };

                        scope.LookupCallback = function (item, header) {
                            if (header.LookupCallback) {
                                header.LookupCallback({ row: item, source: header.Source });
                            }
                        };

                        scope.OnCancel = function (item, $event) {

                            // Stop the click event from bubbling up to the row click event.
                            $event.stopPropagation();

                            if (scope.noDatabase) {
                                if (scope.onCancel && angular.isFunction(scope.onCancel)) {
                                    scope.onCancel({ item: item });
                                }
                            }

                            if (item.isNewItem) {

                                scope.currentPageData.splice(0, 1);
                                return;
                            }

                            $.each(gridSourceOriginal, function (index, obj) {

                                if (obj[scope.keyField] === item[scope.keyField]) {

                                    angular.copy(obj, item);

                                    return;
                                }
                            });

                            item.isEditMode = false;

                            if (angular.isFunction(scope.onCancel)) {
                                scope.onCancel({
                                    item: item
                                });
                            }

                        };

                        scope.OnSave = function (item, $event) {

                            // Stop the click event from bubbling up to the row click event.
                            $event.stopPropagation();

                            if (item.isNewItem) {
                                if (scope.onCreate && angular.isFunction(scope.onCreate)) {

                                    blockGrid();
                                    if (scope.noDatabase) {
                                        scope.onCreate({ item: item }).then(function () {
                                            if (scope.currentPageData.length > 0 && scope.currentPageData[0].isNewItem) {
                                                scope.currentPageData.splice(0, 1);
                                            }
                                            unblockGrid();
                                            item.isEditMode = false;
                                            item.isNewItem = false;
                                        }, onError);

                                    } else {
                                        scope.onCreate({ item: item })
                                            .then(
                                                function () {
                                                    if (scope.currentPageData.length > 0 && scope.currentPageData[0].isNewItem) {
                                                        scope.currentPageData.splice(0, 1);
                                                    }

                                                    unblockGrid();
                                                    item.isEditMode = false;
                                                },
                                                onError
                                            );
                                    }
                                }
                            } else {

                                if (scope.onSave && angular.isFunction(scope.onSave)) {

                                    blockGrid();
                                    scope.onSave({ item: item })
                                        .then(
                                            onSuccess,
                                            onError
                                        );
                                }
                            }


                            function onSuccess() {

                                $.each(gridSourceOriginal, function (index, obj) {

                                    if (obj[scope.keyField] === item[scope.keyField]) {

                                        angular.copy(item, obj);

                                        return;
                                    }
                                });

                                item.isEditMode = false;

                                $timeout(function () {
                                    scope.$apply();
                                });

                                unblockGrid();
                            }

                            function onError() {
                                unblockGrid();
                            }
                        };

                        scope.OnDelete = function (item, $event) {

                            // Stop the click event from bubbling up to the row click event.
                            $event.stopPropagation();

                            scope.deleteDisplayKey = item[scope.deleteDisplayField];

                            deleteConfirmationDialog.modal(
                                {
                                    backdrop: 'static'
                                }
                            );

                            btnCancelDeleteConfirm.on('click', function () {
                                deleteConfirmationDialog.modal('hide');
                            });

                            btnDeleteConfirm.off();

                            btnDeleteConfirm.on('click', function () {

                                if (scope.onDelete && angular.isFunction(scope.onDelete)) {

                                    blockGrid();
                                    btnDeleteConfirm.prop('disabled', true);

                                    if (scope.noDatabase) {
                                        scope.onDelete({ item: item }).then(
                                            onNoDataBaseSuccess,
                                            onError
                                        );

                                    } else {

                                        scope.onDelete({ item: item })
                                            .then(
                                                onSuccess,
                                                onError
                                            );
                                    }
                                }
                            });

                            function onSuccess() {

                                $.each(gridSourceOriginal, function (index, obj) {

                                    if (obj) {
                                        if (obj[scope.keyField] === item[scope.keyField]) {

                                            gridSourceOriginal.splice(gridSourceOriginal.indexOf(obj), 1);

                                            scope.filteredSource.splice(scope.filteredSource.indexOf(item), 1);

                                            //scope.gridSource.splice(scope.gridSource.indexOf(item), 1);

                                            return;
                                        }
                                    }

                                });

                                scope.calculatePageCount();

                                scope.SetCurrentPageData();

                                $timeout(function () {
                                    scope.$apply();
                                });

                                btnDeleteConfirm.prop('disabled', false);
                                deleteConfirmationDialog.modal('hide');
                                $('.modal-backdrop').remove();
                                unblockGrid();
                            }

                            function onError() {
                                btnDeleteConfirm.prop('disabled', false);
                                deleteConfirmationDialog.modal('hide');
                                $('.modal-backdrop').remove();
                                unblockGrid();
                            }

                            function onNoDataBaseSuccess() {

                                $.each(gridSourceOriginal, function (index, obj) {
                                    if (obj) {
                                        if (obj[scope.keyField] === item[scope.keyField]) {
                                            gridSourceOriginal.splice(gridSourceOriginal.indexOf(obj), 1);
                                            return;
                                        }
                                    }
                                });
                                scope.calculatePageCount();
                                scope.SetCurrentPageData();
                                $timeout(function () {
                                    scope.$apply();
                                });
                                btnDeleteConfirm.prop('disabled', false);
                                deleteConfirmationDialog.modal('hide');
                                $('.modal-backdrop').remove();
                                unblockGrid();
                            }
                        };

                        scope.NavClick = function (command, page) {

                            switch (command) {
                                case 'prev':
                                    previousPage();
                                    break;
                                case 'next':
                                    nextPage();
                                    break;
                                case 'first':
                                    firstPage();
                                    break;
                                case 'last':
                                    lastPage();
                                    break;
                                case 'current':
                                    setCurrentPage(page);
                                    break;
                                case 'prev-pagination':

                                    if (scope.currentPage === 1) {
                                        return;
                                    } else {
                                        scope.currentPage--;
                                    }

                                    break;
                                case 'next-pagination':

                                    if (scope.currentPage > scope.pages.length / scope.rpp) {
                                        return;
                                    } else {
                                        scope.currentPage++;
                                    }

                                    break;
                            }

                            function setCurrentPage(page) {
                                $.each(scope.pages, function (index, item) {
                                    item.status = null;
                                });

                                page.status = 'active';

                                scope.currentPage = Math.ceil(page.page / scope.rpp);

                                scope.SetCurrentPageData();
                            }

                            function firstPage() {
                                for (var index = 0; index < scope.pages.length; index++) {

                                    if (scope.pages[index].status) {
                                        if (index === 0) {
                                            return;
                                        } else {
                                            scope.currentPage = 1;

                                            setCurrentPage(scope.pages[0]);
                                            break;
                                        }
                                    }
                                }
                            }

                            function lastPage() {
                                for (var index = 0; index < scope.pages.length; index++) {

                                    if (scope.pages[index].status) {
                                        if (index === scope.pages.length - 1) {
                                            return;
                                        } else {
                                            scope.currentPage = Math.ceil(scope.pages.length / scope.rpp);

                                            setCurrentPage(scope.pages[scope.pages.length - 1]);
                                            break;
                                        }
                                    }
                                }
                            }

                            function previousPage() {

                                for (var index = 0; index < scope.pages.length; index++) {

                                    if (scope.pages[index].status) {

                                        if (index === 0) {
                                            return;
                                        } else {
                                            setCurrentPage(scope.pages[index - 1]);
                                            break;
                                        }
                                    }
                                }
                            }

                            function nextPage() {

                                for (var index = 0; index < scope.pages.length; index++) {

                                    if (scope.pages[index].status) {

                                        if (index === scope.pages.length - 1) {
                                            return;
                                        } else {
                                            setCurrentPage(scope.pages[index + 1]);
                                            break;
                                        }
                                    }
                                }
                            }
                        };


                        scope.$watchCollection('gridSource', function (newValue, oldValue) {

                            angular.copy(scope.gridSource, gridSourceOriginal);

                            scope.filteredSource = scope.gridSource;

                            scope.calculatePageCount();
                            scope.SetCurrentPageData();
                        });

                        scope.$watch('pageSize', function (newValue, oldValue) {

                            scope.calculatePageCount();
                            scope.SetCurrentPageData();

                        });

                        // This function is used by the gird to determine if the source for dropdown is an object or a string.
                        scope.getSelectValue = function (source, property) {

                            if (angular.isObject(source)) {
                                return source[property];
                            }

                            return source;
                        };

                        function blockGrid() {
                            if ($(element).parent('div')) {
                                $(element).parent('div').block({ message: '<img src="css/images/ajax-loader.gif" /> loading...' });
                            }
                        }

                        function unblockGrid() {
                            if ($(element).parent('div')) {
                                $(element).parent('div').unblock();
                            }
                        }

                        // Enable bootstrap tooltips.
                        $('[data-toggle="tooltip"]').tooltip();
                    }
                };
            }
        ]).
        directive('psxColumnFilter', [
            '$filter', '$timeout', '$rootScope', function ($filter, $timeout, $rootScope) {

                return {
                    transclude: true,

                    scope: {
                        columnSource: '='
                    },

                    restrict: 'E',

                    require: '^csGrid',

                    template: '<input class="form-control input-sm" type="text" placeholder="Filter" ng-model="ColFilter">',

                    link: function (scope, elem, attrs, controllerInstance) {

                        scope.$watch('ColFilter', function (newValue, oldValue) {

                            controllerInstance.filterColumn(newValue, scope.columnSource);

                        });
                    }
                };
            }
        ]).
        directive('csCalendar', [
            '$filter', '$timeout', '$rootScope', function ($filter, $timeout, $rootScope) {

                return {
                    transclude: true,
                    restrict: 'E',
                    //require: '^?form',

                    scope: {
                        dateTimeFormat: '@',
                        sourceField: '=',
                        isRequired: '=',
                        isDisabled: '='
                    },

                    template:
                        '<p class="input-group">' +
                            '<input type="text" class="form-control input-sm" datepicker-popup="{{dateTimeFormat}}" datepicker-append-to-body=true ng-change="DateChange(sourceField)" ng-model="sourceField" is-open="opened" datepicker-options="dateOptions" ng-required="isRequired" close-text="Close" />' +
                            '<span class="input-group-btn">' +
                            '<button type="button" class="btn btn-default btn-sm" ng-disabled="isDisabled" ng-click="opencal($event)"><i class="fa fa-calendar"></i></button>' +
                            '</span>' +
                            '</p>',
                    controller: ['$scope', function ($scope) {

                        $scope.DateChange = function (data) {
                            $scope.sourceField = $filter('date')(data, $scope.dateTimeFormat);
                        };
                    }],

                    link: function (scope, elem, attrs, ctrl) {

                        scope.opencal = function ($event) {
                            $event.stopPropagation();

                            scope.opened = true;
                        };

                        scope.dateOptions = {
                            formatYear: 'yy',
                            startingDay: 1
                        };

                        scope.format = 'dd/MM/yyyy';
                    }
                };
            }
        ]).
        directive('csValidationSummary', [
            '$filter', '$timeout', function ($filter, $timeout) {

                return {
                    transclude: true,
                    restrict: 'E',

                    scope: {
                        validationSource: '='
                    },

                    templateUrl: './Content/Views/Templates/ValidationSummary.html?v=' + new Date().getMilliseconds(),

                    link: function (scope, elem, attrs) {

                    }
                };
            }
        ]).
        directive("psxUploadForm", [
            "$rootScope", "$http",
            function () {
                return {
                    restrict: "E",
                    templateUrl: "./Content/templates/fileform.html",
                    scope: {
                        allowed: "@",
                        url: "@",
                        allowAdd: "@",
                        preventDelete: "@",
                        autoUpload: "@",
                        sizeLimit: "@",
                        ngModel: "=",
                        name: "@"
                    },
                    controller: ['$rootScope', '$scope', '$element', '$http', function ($rootScope, $scope, $element, $http) {
                        $scope.options = {
                            url: $scope.url,
                            dropZone: $element,
                            maxFileSize: $scope.sizeLimit,
                            autoUpload: $scope.autoUpload,
                            allowAdd: $scope.allowAdd,
                            preventDelete: $scope.preventDelete
                        };
                        if (!$scope.queue) {
                            $scope.queue = [];
                        }
                        $scope.$watch(function (scope) { return scope.allowAdd; }, function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                $scope.options.allowAdd = newValue;
                            }
                        });
                        $scope.$watch(function (scope) { return scope.preventDelete; }, function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                $scope.options.preventDelete = newValue;
                            }
                        });
                        $scope.loadingFiles = true;
                        $http.get($scope.url)
                            .then(
                                function (response) {
                                    $scope.loadingFiles = false;
                                    if (response.data.files) {
                                        angular.forEach(response.data.files, function (value, key) {
                                            $scope.queue[key] = value;
                                        });
                                    }
                                },
                                function () {
                                    $scope.loadingFiles = false;
                                }
                            );
                    }]
                };
            }
        ])
        .directive('psxMultiSelect', [
            function () {

                return {
                    transclude: true,

                    restrict: 'E',

                    scope: {
                        selectedItems: '=',
                        selectedKeys: '=',
                        selectSource: '=',
                        displayText: '@',
                        keyField: '@',
                        inputwidth: '@',
                        showAll: '='
                    },

                    template: '<div class="btn-group">' +
                        '<button class="btn btn-default dropdown-toggle multiselectbutton" type="button" ng-click="showDropdownMenu()"; numberOfSelected() style="width:{{inputwidth}}">' +
                        '<span ng-if="showAll"> -- All -- </span><span ng-if="!showAll"> Selected </span> &nbsp;<span class="caret pull-right caretdown"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu">' +
                        '<li ng-repeat="item in selectSource">&nbsp;<input type="checkbox" ng-checked="getChecked(item)" ng-click="addItems(item)" /> {{item[displayText]}}</li>' +
                        '</ul>' +
                        '</div>',

                    link: function (scope, elem, attrs) {
                        scope.showAll = true;
                        //scope.selectedKeys = '';

                        scope.getChecked = function (item) {

                            if (scope.selectedItems) {

                                for (var index = 0; index < scope.selectedItems.length; index++) {
                                    if (scope.selectedItems[index][scope.keyField] === item[scope.keyField]) {
                                        return true;
                                    }
                                }
                            }

                            return false;
                        };

                        scope.addItems = function (item) {

                            scope.selectedKeys = '';
                            if (!scope.selectedItems) {
                                scope.selectedItems = [];
                            }

                            var existing = false;

                            for (var index = 0; index < scope.selectedItems.length; index++) {
                                if (scope.selectedItems[index][scope.keyField] === item[scope.keyField]) {

                                    scope.selectedItems.splice(index, 1);
                                    existing = true;

                                    break;
                                }
                            }

                            if (!existing) {
                                scope.selectedItems.push(angular.copy(item));
                            }

                            var cnt = 0;
                            var idTxt = '';
                            angular.forEach(scope.selectedItems, function (key, itm) {
                                //clean
                                if (scope.keyField === "Id") {
                                    idTxt = key.Id;
                                } else {
                                    if (!isNaN(key.Key)) {
                                        idTxt = key.Key;
                                    } else {
                                        idTxt = key.Key.replace('&', '|');
                                        idTxt = idTxt.replace(',', '_');
                                    }
                                }
                                //assign
                                if (cnt !== 0) {
                                    scope.selectedKeys = scope.selectedKeys + ',' + idTxt;
                                } else {
                                    scope.selectedKeys = idTxt;
                                }
                                cnt++;
                            });

                            console.log(scope.selectedKeys);

                            if (scope.selectedItems.length > 0) {
                                scope.showAll = false;
                            } else {
                                scope.showAll = true;
                            }
                        };

                        var modal = $(elem).find(".dropdown-menu");
                        var body = $('html');
                        elem.data('psxMultiSelect', true);
                        angular.element(body).on('click', function (e) {
                            var inThing = angular.element(e.target).inheritedData('psxMultiSelect');
                            if (inThing) {
                                e.stopPropagation();
                            } else {
                                modal.hide();
                            }
                        });
                        scope.showDropdownMenu = function () {

                            if (modal.is(":visible")) {
                                modal.hide();
                            } else {
                                modal.show();
                            }
                        };

                    }
                };
            }])
        .controller("FileDestroyController", [
            "$rootScope", "$scope", "$http",
            function ($rootScope, $scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = "pending";
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = "resolved";
                                $scope.clear(file);
                            },
                            function () {
                                state = "rejected";
                                $scope.clear(file);
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]).
        directive('modal', function () {
            return {
                template: '<div class="modal fade" data-backdrop ="static" data-keyboard="false">' +
                    '<div style="margin-top: 100px" class="modal-dialog modal-top-margin">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<h4 class="modal-title">{{ title }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: true,
                link: function postLink(scope, element, attrs) {

                    scope.$watch(attrs.visible, function (value) {
                        if (value === true)
                            $(element).modal('show');
                        else {
                            $(element).modal('hide');
                            $('.modal-backdrop').remove();
                        }

                    });

                    $(element).on('shown.bs.modal', function () {
                        scope.$apply(function () {
                            scope.$parent[attrs.visible] = true;
                        });
                    });

                    $(element).on('hidden.bs.modal', function () {
                        scope.$apply(function () {
                            scope.$parent[attrs.visible] = false;
                        });
                    });
                }
            };
        }).
        directive('fileBrowser', function () {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                scope: false,
                template:
                    '<div class="input-prepend extended-date-picker">' +
                        '<input type="button" class="btn" value="browse...">' +
                        '<input type="text" readonly class="override">' +
                        '<div class="proxied-field-wrap" ng-transclude></div>' +
                        '</div>',
                link: function ($scope, $element, $attrs, $controller) {
                    var button, fileField, proxy;
                    fileField = $element.find('[type="file"]').on('change', function () {
                        proxy.val(angular.element(this).val());
                    });
                    proxy = $element.find('[type="text"]').on('click', function () {
                        fileField.trigger('click');
                    });
                    button = $element.find('[type="button"]').on('click', function () {
                        fileField.trigger('click');
                    });
                }
            };
        }).
        directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {

                        if (inputValue === undefined)
                            return '';

                        var transformedInput = inputValue.replace(/[^0-9]/g, '');
                        if (transformedInput !== inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
            };
        }).
        directive('relinkEvent', [
            '$rootScope', function ($rootScope) {
                return {
                    transclude: 'element',
                    restrict: 'A',
                    link: function (scope, element, attr, ctrl, transclude) {
                        var previousContent = null;

                        var triggerRelink = function () {
                            if (previousContent) {
                                previousContent.remove();
                                previousContent = null;
                            }

                            transclude(function (clone) {
                                console.log('relinking');
                                element.parent().append(clone);
                                previousContent = clone;
                            });

                        };

                        triggerRelink();
                        $rootScope.$on(attr.relinkEvent, triggerRelink);

                    }
                };

            }]).
        directive('ngCurrency', [
            '$filter', '$locale', function ($filter, $locale) {
                return {
                    require: 'ngModel',
                    scope: {
                        min: '=min',
                        max: '=max',
                        currencySymbol: '@',
                        ngRequired: '=ngRequired'
                    },
                    link: function (scope, element, attrs, ngModel) {

                        function decimalRex(dChar) {
                            return RegExp("\\d|\\-|\\" + dChar, 'g');
                        }

                        function clearRex(dChar) {
                            return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0,2}", 'g');
                        }

                        function clearValue(value) {
                            value = String(value);
                            var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                            var cleared = null;

                            if (RegExp("^-[\\s]*$", 'g').test(value)) {
                                value = "-0";
                            }

                            if (decimalRex(dSeparator).test(value)) {
                                cleared = value.match(decimalRex(dSeparator))
                                    .join("").match(clearRex(dSeparator));
                                cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                            } else {
                                cleared = null;
                            }

                            return cleared ? cleared : "0";
                        }

                        function currencySymbol() {
                            if (angular.isDefined(scope.currencySymbol)) {
                                return scope.currencySymbol;
                            } else {
                                return $locale.NUMBER_FORMATS.CURRENCY_SYM;
                            }
                        }

                        ngModel.$parsers.push(function (viewValue) {
                            var cVal = clearValue(viewValue);
                            return parseFloat(cVal);
                        });

                        element.on("blur", function () {
                            if (ngModel.$modelValue === "0") {
                                $(this).val('').removeClass('placeholder');
                            }

                            ngModel.$modelValue = ngModel.$modelValue ? ngModel.$modelValue : "0";
                            var value = $filter('currency')(ngModel.$modelValue, currencySymbol());

                            element.val(value);
                        });
                        element.on("keydown", function () {

                            var allowedSpecialCharKeyCodes = [45, 46, 8, 37, 39, 35, 36, 9, 189];
                            var numberKeyCodes = [44, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
                            var commaKeyCode = [188];
                            var decimalKeyCode = [190, 110];

                            var legalKeyCode =
                                (!event.shiftKey && !event.ctrlKey && !event.altKey)
                                    &&
                                    (jQuery.inArray(event.keyCode, allowedSpecialCharKeyCodes) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, numberKeyCodes) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, commaKeyCode) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, decimalKeyCode) >= 0);

                            // Allow for $
                            if (!legalKeyCode && event.shiftKey && event.keyCode === 52)
                                legalKeyCode = true;

                            if (legalKeyCode === false)
                                event.preventDefault();

                        });

                        ngModel.$formatters.unshift(function (value) {
                            if (value !== undefined && value !== null) {

                                if (value.indexOf("$") === 0) {
                                    value = value.substring(1);
                                }


                            }
                            return $filter('currency')(value, currencySymbol());
                        });

                        scope.$watch(function () {
                            return ngModel.$modelValue;
                        }, function (newValue, oldValue) {
                            runValidations(newValue);
                        });

                        function runValidations(cVal) {
                            if (isNaN(cVal)) {
                                return;
                            }
                            if (scope.min) {
                                var min = parseFloat(scope.min);
                                ngModel.$setValidity('min', cVal >= min);
                            }
                            if (scope.max) {
                                var max = parseFloat(scope.max);
                                ngModel.$setValidity('max', cVal <= max);
                            }
                        }
                    }
                };
            }
        ]).
        directive('ngPercent', [
            '$filter', '$locale', function ($filter, $locale) {
                return {
                    require: 'ngModel',
                    scope: {
                        min: '=min',
                        max: '=max',
                        percentSymbol: '@',
                        ngRequired: '=ngRequired'
                    },
                    link: function (scope, element, attrs, ngModel) {

                        function decimalRex(dChar) {
                            return RegExp("\\d|\\-|\\" + dChar, 'g');
                        }

                        function clearRex(dChar) {
                            return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0,2}", 'g');
                        }

                        function clearValue(value) {
                            value = String(value);
                            var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                            var cleared = null;

                            if (RegExp("^-[\\s]*$", 'g').test(value)) {
                                value = "-0";
                            }

                            if (decimalRex(dSeparator).test(value)) {
                                cleared = value.match(decimalRex(dSeparator))
                                    .join("").match(clearRex(dSeparator));
                                cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                            } else {
                                cleared = null;
                            }

                            return cleared;
                        }

                        function percentSymbol() {
                            return '%';
                        }

                        ngModel.$parsers.push(function (viewValue) {
                            var cVal = clearValue(viewValue);
                            return parseFloat(cVal);
                        });

                        element.on("blur", function () {

                            var itemValue = ngModel.$modelValue;

                            if (ngModel.$modelValue !== 0 && ngModel.$modelValue !== null) {
                                var index = ngModel.$modelValue.toString().indexOf(percentSymbol());
                                if (index < 0 && !isNaN(itemValue)) {
                                    itemValue = $filter('number')(itemValue, 2) + percentSymbol();
                                } else if (isNaN(itemValue)) {
                                    itemValue = '0.00' + percentSymbol();

                                }


                            }

                            element.val(itemValue);
                        });

                        element.on("keydown", function () {
                            // key codes from left to right: backspace, tab, ctrl, end, home, left arrow, up arrow, right arrow, down arrow, delete, C, V
                            var allowedSpecialCharKeyCodes = [8, 9, 17, 35, 36, 37, 38, 39, 40, 46, 67, 86];
                            var numberKeyCodes = [44, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
                            //var commaKeyCode = [188];
                            var decimalKeyCode = [190, 110];

                            var legalKeyCode =
                                (!event.shiftKey && !event.ctrlKey && !event.altKey)
                                    &&
                                    (jQuery.inArray(event.keyCode, allowedSpecialCharKeyCodes) >= 0
                                        ||
                                        jQuery.inArray(event.keyCode, numberKeyCodes) >= 0
                                        ||
                                        //jQuery.inArray(event.keyCode, commaKeyCode) >= 0
                                        //||
                                        jQuery.inArray(event.keyCode, decimalKeyCode) >= 0);

                            // Allow for $
                            if (!legalKeyCode && event.shiftKey && event.keyCode === 52)
                                legalKeyCode = true;

                            if (legalKeyCode === false)
                                event.preventDefault();

                        });

                        ngModel.$formatters.unshift(function (value) {

                            var itemValue = value;

                            if (ngModel.$modelValue !== 0 && ngModel.$modelValue !== null && !isNaN(ngModel.$modelValue)) {
                                var index = ngModel.$modelValue.toString().indexOf(percentSymbol());
                                if (index < 0) {
                                    itemValue = $filter('number')(value, 2) + percentSymbol();
                                }
                            }

                            return itemValue;

                        });

                        scope.$watch(function () {
                            return ngModel.$modelValue;
                        }, function (newValue, oldValue) {
                            runValidations(newValue);
                        });

                        function runValidations(cVal) {
                            if (isNaN(cVal)) {
                                return;
                            }
                            if (scope.min) {
                                var min = parseFloat(scope.min);
                                ngModel.$setValidity('min', cVal >= min);
                            }
                            if (scope.max) {
                                var max = parseFloat(scope.max);
                                ngModel.$setValidity('max', cVal <= max);
                            }
                        }
                    }
                };
            }
        ])
 //Date-Time picker
        .constant('datetimepickerPopupConfig', {
            altInputFormats: [],
            datetimepickerPopup: 'yyyy-MM-dd HH:mm',
            html5Types: {
                date: 'yyyy-MM-dd',
                'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
                'month': 'yyyy-MM'
            },
            enableDate: true,
            enableTime: true,
            todayText: 'Today',
            nowText: 'Now',
            clearText: 'Clear',
            closeText: 'Done',
            dateText: 'Date',
            timeText: 'Time',
            onOpenFocus: true,
            closeOnDateSelection: true,
            appendToBody: false,
            showButtonBar: true
        })
        .directive('datetimepickerPopup', ['$compile', '$parse', '$document', '$uibPosition', 'dateFilter', 'uibDateParser', 'datetimepickerPopupConfig', '$timeout',
            function ($compile, $parse, $document, $uibPosition, dateFilter, uibDateParser, datetimepickerPopupConfig, $timeout) {
                return {
                    restrict: 'EA',
                    require: 'ngModel',
                    scope: {
                        isOpen: '=?',
                        enableDate: '=?',
                        enableTime: '=?',
                        todayText: '@',
                        nowText: '@',
                        clearText: '@',
                        closeText: '@',
                        dateText: '@',
                        timeText: '@',
                        dateDisabled: '&'
                    },
                    link: function (scope, element, attrs, ngModel) {
                        var dateFormat,
                            closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datetimepickerPopupConfig.closeOnDateSelection,
                            appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datetimepickerPopupConfig.appendToBody;

                        scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datetimepickerPopupConfig.showButtonBar;

                        // determine which pickers should be available. Defaults to date and time
                        scope.enableDate = angular.isDefined(scope.enableDate) ? scope.enableDate : datetimepickerPopupConfig.enableDate;
                        scope.enableTime = angular.isDefined(scope.enableTime) ? scope.enableTime : datetimepickerPopupConfig.enableTime;

                        // default picker view
                        scope.showPicker = scope.enableDate ? 'date' : 'time';

                        scope.getText = function (key) {
                            return scope[key + 'Text'] || datetimepickerPopupConfig[key + 'Text'];
                        };
                        var isHtml5DateInput = false;
                        if (datetimepickerPopupConfig.html5Types[attrs.type]) {
                            dateFormat = datetimepickerPopupConfig.html5Types[attrs.type];
                            isHtml5DateInput = true;
                        } else {
                            dateFormat = attrs.datetimepickerPopup || datetimepickerPopupConfig.datetimepickerPopup;
                            attrs.$observe('datetimepickerPopup', function (value) {
                                var newDateFormat = value || datetimepickerPopupConfig.datetimepickerPopup;

                                if (newDateFormat !== dateFormat) {
                                    dateFormat = newDateFormat;
                                    ngModel.$modelValue = null;

                                    if (!dateFormat) {
                                        throw new Error('datetimePicker must have a date format specified.');
                                    }
                                }
                            });
                        }
                        var popupEl = angular.element('' +
                            '<div date-picker-wrap>' +
                            '<div uib-datepicker></div>' +
                            '</div>' +
                            '<div time-picker-wrap>' +
                            '<div uib-timepicker style="margin:0 auto"></div>' +
                            '</div>');
                        popupEl.attr({
                            'ng-model': 'date',
                            'ng-change': 'dateSelection(date)'
                        });

                        function cameltoDash(string) {
                            return string.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); });
                        }

                        // datepicker element
                        var datepickerEl = angular.element(popupEl.children()[0]);

                        if (isHtml5DateInput) {
                            if (attrs.type === 'month') {
                                datepickerEl.attr('datepicker-mode', '"month"');
                                datepickerEl.attr('min-mode', 'month');
                            }
                        }

                        if (attrs.datepickerOptions) {
                            var options = scope.$parent.$eval(attrs.datepickerOptions);

                            if (options && options.initDate) {
                                scope.initDate = options.initDate;
                                datepickerEl.attr('init-date', 'initDate');
                                delete options.initDate;
                            }

                            angular.forEach(options, function (value, option) {
                                datepickerEl.attr(cameltoDash(option), value);
                            });
                        }

                        // timepicker element
                        var timepickerEl = angular.element(popupEl.children()[1]);

                        if (attrs.timepickerOptions) {
                            var options = scope.$parent.$eval(attrs.timepickerOptions);

                            angular.forEach(options, function (value, option) {
                                timepickerEl.attr(cameltoDash(option), value);
                            });
                        }

                        // set datepickerMode to day by default as need to create watch
                        // else disabled cannot pass in mode
                        if (!angular.isDefined(attrs['datepickerMode'])) {
                            attrs['datepickerMode'] = 'day';
                        }

                        scope.watchData = {};
                        angular.forEach(['minMode', 'maxMode', 'minDate', 'maxDate', 'datepickerMode', 'initDate', 'shortcutPropagation'], function (key) {
                            if (attrs[key]) {
                                var getAttribute = $parse(attrs[key]);
                                scope.$parent.$watch(getAttribute, function (value) {
                                    scope.watchData[key] = value;
                                });
                                datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

                                // Propagate changes from datepicker to outside
                                if (key === 'datepickerMode') {
                                    var setAttribute = getAttribute.assign;
                                    scope.$watch('watchData.' + key, function (value, oldvalue) {
                                        if (angular.isFunction(setAttribute) && value !== oldvalue) {
                                            setAttribute(scope.$parent, value);
                                        }
                                    });
                                }
                            }
                        });

                        if (attrs.dateDisabled) {
                            datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
                        }

                        // do not check showWeeks attr, as should be used via datePickerOptions

                        function parseDate(viewValue) {
                            if (angular.isNumber(viewValue)) {
                                // presumably timestamp to date object
                                viewValue = new Date(viewValue);
                            }

                            if (!viewValue) {
                                return null;
                            } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                                return viewValue;
                            } else if (angular.isString(viewValue)) {
                                var date = uibDateParser.parse(viewValue, dateFormat, scope.date);
                                if (isNaN(date)) {
                                    return undefined;
                                } else {
                                    return date;
                                }
                            } else {
                                return undefined;
                            }
                        }

                        function validator(modelValue, viewValue) {
                            var value = modelValue || viewValue;

                            if (!attrs.ngRequired && !value) {
                                return true;
                            }

                            if (angular.isNumber(value)) {
                                value = new Date(value);
                            }
                            if (!value) {
                                return true;
                            } else if (angular.isDate(value) && !isNaN(value)) {
                                return true;
                            } else if (angular.isDate(new Date(value))) {
                                return true;
                            } else if (angular.isString(value)) {
                                var date = uibDateParser.parse(value, dateFormat);
                                return !isNaN(date);
                            } else {
                                return false;
                            }
                        }

                        if (!isHtml5DateInput) {
                            // Internal API to maintain the correct ng-invalid-[key] class
                            ngModel.$$parserName = 'datetime';
                            ngModel.$validators.datetime = validator;
                            ngModel.$parsers.unshift(parseDate);
                            ngModel.$formatters.push(function (value) {
                                scope.date = value;
                                return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
                            });
                        } else {
                            ngModel.$formatters.push(function (value) {
                                scope.date = value;
                                return value;
                            });
                        }

                        // Inner change
                        scope.dateSelection = function (dt) {

                            // check if timePicker is being shown and merge dates, so that the date
                            // part is never changed, only the time
                            if (scope.enableTime && scope.showPicker === 'time') {

                                // only proceed if dt is a date
                                if (dt || dt !== null) {
                                    // check if our scope.date is null, and if so, set to todays date
                                    if (!angular.isDefined(scope.date) || scope.date === null) {
                                        scope.date = new Date();
                                    }

                                    // dt will not be undefined if the now or today button is pressed
                                    if (dt && dt !== null) {
                                        // get the existing date and update the time
                                        var date = new Date(scope.date);
                                        date.setHours(dt.getHours());
                                        date.setMinutes(dt.getMinutes());
                                        date.setSeconds(dt.getSeconds());
                                        date.setMilliseconds(dt.getMilliseconds());
                                        dt = date;
                                    }
                                }
                            }

                            if (angular.isDefined(dt)) {
                                scope.date = dt;
                            }

                            var date = scope.date ? dateFilter(scope.date, dateFormat) : null;

                            element.val(date);
                            ngModel.$setViewValue(date);

                            if (dt === null) {
                                scope.close();
                            } else if (closeOnDateSelection) {
                                // do not close when using timePicker as make impossible to choose a time
                                if (scope.showPicker !== 'time') {
                                    // if time is enabled, swap to timePicker
                                    if (scope.enableTime) {
                                        // need to delay this, else timePicker never shown
                                        $timeout(function () {
                                            scope.showPicker = 'time';
                                        }, 0);
                                    } else {
                                        scope.close();
                                    }
                                }
                            }

                        };

                        // Detect changes in the view from the text box
                        ngModel.$viewChangeListeners.push(function () {
                            scope.date = uibDateParser.parse(ngModel.$viewValue, dateFormat, scope.date);
                        });

                        var documentClickBind = function (event) {
                            if (scope.isOpen && !(element[0].contains(event.target) || $popup[0].contains(event.target))) {
                                scope.$apply(function () {
                                    scope.close();
                                });
                            }
                        };

                        var inputKeydownBind = function (evt) {
                            if (evt.which === 27 && scope.isOpen) {
                                evt.preventDefault();
                                evt.stopPropagation();
                                scope.$apply(function () {
                                    scope.close();
                                });
                                element[0].focus();
                            } else if (evt.which === 40 && !scope.isOpen) {
                                evt.preventDefault();
                                evt.stopPropagation();
                                scope.$apply(function () {
                                    scope.isOpen = true;
                                });
                            }
                        };
                        element.bind('keydown', inputKeydownBind);

                        scope.keydown = function (evt) {
                            if (evt.which === 27) {
                                scope.close();
                                element[0].focus();
                            }
                        };

                        scope.$watch('isOpen', function (value) {
                            scope.dropdownStyle = {
                                display: value ? 'block' : 'none'
                            };

                            if (value) {
                                var position = appendToBody ? $uibPosition.offset(element) : $uibPosition.position(element);

                                if (appendToBody) {
                                    scope.dropdownStyle.top = (position.top + element.prop('offsetHeight')) + 'px';
                                } else {
                                    scope.dropdownStyle.top = undefined;
                                }

                                scope.dropdownStyle.left = position.left + 'px';

                                $timeout(function () {
                                    scope.$broadcast('datepicker.focus');
                                    $document.bind('click', documentClickBind);
                                }, 0, false);
                            } else {
                                $document.unbind('click', documentClickBind);
                            }
                        });

                        scope.isDisabled = function (date) {
                            var isToday = (date === 'today');

                            if (date === 'today' || date === 'now')
                                date = new Date();

                            if (attrs.dateDisabled) {
                                return scope.dateDisabled({ date: date, mode: scope.watchData['datepickerMode'] });
                            } else {
                                return false;
                            }
                        };

                        scope.select = function (date) {

                            var isNow = date === 'now';

                            if (date === 'today' || date === 'now') {
                                var now = new Date();
                                if (angular.isDate(scope.date)) {
                                    date = new Date(scope.date);
                                    date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
                                    date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                                } else {
                                    date = now;
                                }
                            }

                            scope.dateSelection(date);
                        };

                        scope.close = function () {
                            scope.isOpen = false;

                            // if enableDate and enableTime are true, reopen the picker in date mode first
                            if (scope.enableDate && scope.enableTime)
                                scope.showPicker = 'date';

                            element[0].focus();
                        };

                        scope.changePicker = function (evt, picker) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            scope.showPicker = picker;
                        };

                        var $popup = $compile(popupEl)(scope);
                        // Prevent jQuery cache memory leak (template is now redundant after linking)
                        popupEl.remove();

                        if (appendToBody) {
                            $document.find('body').append($popup);
                        } else {
                            element.after($popup);
                        }

                        scope.$on('$destroy', function () {
                            if (scope.isOpen === true) {
                                if (!$rootScope.$$phase) {
                                    scope.$apply(function () {
                                        scope.close();
                                    });
                                }
                            }

                            $popup.remove();
                            element.unbind('keydown', inputKeydownBind);
                            $document.unbind('click', documentClickBind);
                        });
                    }
                };
            }
        ])
         .directive('datePickerWrap', function () {
             return {
                 restrict: 'EA',
                 replace: true,
                 transclude: true,
                 templateUrl: 'template/date-picker.html'
             };
         })

        .directive('timePickerWrap', function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                templateUrl: 'template/time-picker.html'
            };
        })
        .directive('psxDatetimePicker', [
       '$filter', '$timeout', '$rootScope', function ($filter, $timeout, $rootScope) {

           return {
               transclude: true,
               restrict: 'E',
               //require: '^?form',

               scope: {
                   dateTimeFormat: '@',
                   mode: '@',
                   sourceField: '=',
                   isRequired: '=',
                   isDisabled: '=',
                   timePicker: '=',
                   datePicker: '='
               },

               template:
                   '<p class="input-group">' +
                       '<input ng-calendar type="text" class="form-control input-sm"  datepicker-mode="{{mode}}" min-mode="{{mode}}" show-weeks="true" datetimepicker-popup="{{dateTimeFormat}}" datepicker-append-to-body=true ng-model="sourceField" is-open="opened" ng-required="isRequired" close-text="Done" enable-time="timePicker" enable-date="datePicker" />' +
                       '<span class="input-group-btn">' +
                       '<button type="button" class="btn btn-default btn-sm" ng-disabled="isDisabled" ng-click="opencal($event)"><i class="fa fa-calendar"></i></button>' +
                       '</span>' +
                       '</p>',
               controller: ['$scope', function ($scope) {
                   $scope.DateChange = function (data) {
                       $scope.sourceField = $filter('date')(data, $scope.dateTimeFormat);
                   };
               }],

               link: function (scope, elem, attrs, ctrl) {

                   scope.opencal = function ($event) {
                       $event.stopPropagation();

                       scope.opened = true;
                   };

                   scope.dateOptions = {
                       formatYear: 'yy',
                       startingDay: 1
                   };

                   scope.format = 'dd/MM/yyyy';

                   scope.$on('closeCal', function (event, data) {
                       scope.opened = false;
                   });
               }
           };
       }
        ])
        .directive('psxDialog', function () {
            return {
                template: '<div class="modal fade" data-backdrop="static" data-keyboard="false">' +
                        '<div  style="margin-top: 100px" class="modal-dialog modal-top-margin">' +
                          '<div class="modal-content">' +
                            '<div class="modal-header">' +
                              '<h4 class="modal-title"><i class="fa fa-warning fa-2x" style="color: #e2b318"></i> {{ title }}</h4>' +
                            '</div>' +
                            '<div class="modal-body" ng-transclude></div>' +
                          '</div>' +
                        '</div>' +
                      '</div>',
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: true,
                link: function postLink(scope, element, attrs) {
                    scope.title = attrs.title;

                    scope.$watch(attrs.visible, function (value) {
                        if (value === true)
                            $(element).modal('show');
                        else
                            $(element).modal('hide');
                    });

                    $(element).on('shown.bs.modal', function () {
                        scope.$apply(function () {
                            scope.$parent[attrs.visible] = true;
                        });
                    });

                    $(element).on('hidden.bs.modal', function () {
                        scope.$apply(function () {
                            scope.$parent[attrs.visible] = false;
                        });
                    });
                }
            };

        })
        .filter('startWith', function () {

            function strStartsWith(str, prefix) {
                return (str.toString().toLowerCase() + "").indexOf(prefix.toLowerCase()) === 0;
            }
            return function (items, search) {
                var name;
                for (var i in search) {
                    name = i;

                }
                var filtered = [];
                angular.forEach(items, function (item) {

                    if (strStartsWith(item[name], search[name])) {
                        filtered.push(item);
                    }
                });

                return filtered;
            };
        })
        // This can be further enhanced to include more messages.
        .factory('csGridService', [
            '$rootScope', function ($rootScope) {

                var message = 'UPDATE_SELECT_SOURCE';

                return {
                    subscribeColumnData: function (scope, callback) {
                        scope.$on(message, function (event, args) {
                            callback(args);
                        });
                    },

                    publishColumnData: function (column, data) {
                        $rootScope.$broadcast(message, { column: column, data: data });
                    }
                };
            }
        ]);

}(angular, jQuery));