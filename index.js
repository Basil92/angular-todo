var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']); 
myApp.controller('todoCtrl', 
    ['myService', '$scope', '$http', '$uibModal','$log', 
    function(myService, $scope, $http, $uibModal, $log) {
    var tdc = this;
    // tdc.todoInput = "test"; tdc.todoText = "test";
    tdc.orderValue = null;

    $http.get("tasklist.json").then(function (response) {
        tdc.tasks = response.data;
        tdc.addTask = function() {
            // console.log(tdc.todoInput + " - " + tdc.todoText + " - tdc in addTask");
            tdc.tasks.push({todoText: tdc.todoInput, todoInfo: tdc.todoText, done:false});
            tdc.todoInput = "";
            tdc.todoText = "";
            console.log(tdc.tasks);
            myService.tasksData = tdc.tasks;
        };

        tdc.remove = function() {
            var oldList = tdc.tasks;
            tdc.tasks = [];
            angular.forEach(oldList, function(x) {
                if (!x.done){
                    tdc.tasks.push(x);
                    // console.log(x);
                }
            });
            
            myService.tasksData = tdc.tasks;
        };
// for modal
                
        $scope.open = function(){
            var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'myModalContent.html',
            controller: 'ModalnstanceCtrl',
            resolve: {
                items: function () {
                    // console.log(tdc.todoInput, tdc.todoText)
                    var resolveData = {todoInput: tdc.todoInput, todoText: tdc.todoText};
                    return resolveData;
                }
            }
        });

        modalInstance.result.then(
          function (resolveData) {
            tdc.todoInput = resolveData.todoInput;
            // console.log(resolveData.todoInput + " - resolveData.todoInput ");
            // console.log(resolveData.todoText + " - resolveData.todoText ");
            tdc.todoText = resolveData.todoText;
            $log.info(tdc.todoInput + " from Press Ok");
            tdc.addTask();
            $log.info('PRESS OKEY');
          },
          function () {
            $log.info('PRESS CANCEL');
        });
        }

    });
}]);

myApp.controller('theTaskCtrl', ['$stateParams', 'myService', 
    function($stateParams, myService) {
    var thtsk = this;
    thtsk.tasksData = myService.tasksData[$stateParams.id];
}]);

myApp.config(function($stateProvider, $urlRouterProvider){
    //if url is undefined go to home
    $urlRouterProvider.otherwise("/")
    // if user choose one task use it
    $stateProvider.state('thetask-qs', {
            url: "/thetask?id",
            templateUrl: "thetask.html",
            // backdropClass  : 'modal-backdrop h-full',
            controller: "theTaskCtrl",
            controllerAs: "thtsk"
        })
        .state("/", {
            url: "/",
            templateUrl: "list.html"
        })
});

myApp.service('myService', function(){
    this.tasksData = {};
});

myApp.controller('ModalnstanceCtrl', ['$scope', '$uibModalInstance', 
    'items', function ($scope, $uibModalInstance, items) {
    $scope.items = items;
    // console.log($scope.items+ " todoinput from InstanseCtrl")
    
    $scope.ok = function () {
        var resolveData = {todoInput: $scope.todoInput, todoText: $scope.todoInfo};
        // console.log(resolveData.todoText + " scope OK after init")
        $uibModalInstance.close(resolveData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };    
}]);



