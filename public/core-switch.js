var app = angular.module('core-switch',[]);

app.controller('appSwitch',function($scope){
    $scope.tabs = ['Home','User','Admin'];
    $scope.selected = $scope.tabs[0];

    $scope.switchContent = function(index){
        $scope.selected = $scope.tabs[index];
    };
});
