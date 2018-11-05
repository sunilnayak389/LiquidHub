/* global angular */
(function () {
    angular.module('demoservice', ['CommonServices'])
        .factory('demoService', [
            '$q', 'DataService', function ($q, dataService) {
                return {
                    GetGridData: function () {
                        return dataService.get('http://localhost:50720/api/Employee/GetEmployee', false);
                    
                    }
                    //GenerateCode: function (values) {
                    //    return dataService.post('api/Admin/GenerateCode', values);
                    //},
                  
                    //DeleteGraduationDetails: function (id) {
                    //    return dataService.post('api/Admin/DeleteGraduationDetails/' + id);
                    //},
                    //SaveAssignCode: function (values) {
                    //    return dataService.post('api/Admin/SaveAssignCode', values);
                    //},
                };
            }
        ]);
})();