angular.module('SitterAdvantage.taskControllers', [])

.controller('UpcomingTasksCtrl', ["$scope", "Tasks", "$state", 
      function ($scope, Tasks, $state) {

        //alert("hi");
          console.log("UpcomingTasksCtrl is loaded");
          $scope.tasks = [];
          $scope.tasks = Tasks.all();
          $scope.addTask = function(){
            $state.go("tab.new-task");

          }

          $scope.taskClicked = function($index){

            var item = $scope.tasks[$index];

              // var param = { client_id:item.clientId, task_id:item.taskId};

              $state.go('tab.task-detail' +item.taskId);
              
            }
      }])

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams","$ionicNavBarDelegate", 
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate) {
                            
      $ionicNavBarDelegate.showBackButton(false);
                        
      console.log("im inside new task controller");
      $scope.cancelNewTask = function () {
        $state.go("tab.tasks");
      };

      //selecting clients and filtering kids to dispay on "new task" form
      //Clients.loadFromDB();
      $scope.kids = [];
      $scope.cid = 0; //3;
      $scope.clientList = Clients.all();
      
      //$scope.selectedKidId = 0;

      //console.log($scope.clientList[0]);
      //console.log("NewTaskCtrl :: $scope.clientList " + $scope.clientList.length);
      $scope.kidList = []; //[{"kidId":1, "kidName":"Jack"},{"kidId":2, "kidName":"Andrea"},{"kidId":3, "kidName":"Ariana"}];

      $scope.newTask = {
        clientName: "",
        kidName: "",
        taskTitle: "",
        taskDescription: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        taskNotes: ""
      };

      $scope.saveNewTask = function (data) {
        console.dir($scope);

      Tasks.createNewTask($scope.newTask);
       console.log("inside saveNewTask ");
        $state.go("tab.tasks");
      };

      $scope.loadKiddy = function( cid ){
          console.log( JSON.stringify($scope.clientList));
          console.log( cid ); 
          var num = $scope.clientList.length;
          for(var c=0; c<num; c++){
            console.log("matching..." + $scope.clientList[c].clientId +" "+ cid);
            if( $scope.clientList[c].clientId == cid){
              $scope.kids = $scope.clientList[c].kids;
              $scope.newTask.clientId = cid;
              console.log( JSON.stringify($scope.kids));
            }
          }
      }

      


  }])

.controller('TasksDetailCtrl', ["$scope", "Tasks","$stateParams","Clients", function ($scope, Tasks,$stateParams,Clients) {
  
  console.log("inside task details controller");

 // alert('hi');

  console.log($stateParams.taskId);

  // $scope.selectedClient = Clients.getById($stateParams.client_id);
  $scope.task = Tasks.get($stateParams.taskId);
              
}]);