(function(){
    "use strict";
    var module = angular.module("first-module", [
        "ngRoute"
    ]);
    module.controller("FirstController", ["$scope",function($scope){
        var model = {
            show: false,
            name: ""
        };
        $scope.model = model;
    }]);
})();