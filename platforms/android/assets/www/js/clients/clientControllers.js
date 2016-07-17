angular.module('SitterAdvantage.clientControllers', [])
.controller('ClientsCtrl', ["$scope", "Clients", "$state",
 function($scope, Clients, $state) {

  console.log("ClientsCtrl is loaded");
  $scope.clients = [];
  $scope.clients = Clients.all();
  
  // Nehmat's old code
  //$scope.clients = Clients.all();
  // $scope.remove = function(client) {
  //   Clients.remove(client);
  // };
  $scope.addClient = function(){
    $state.go("tab.new-client");
  };
}])

.controller('ClientDetailCtrl',["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state",
 function($scope, $stateParams, Clients, $ionicNavBarDelegate, $state) {

  $scope.selectedClient = {};
  
  /*This delegate code is used to decide when to have the back button automatic functionality
  created by ionic. For example in client detail controller i set it to true because i want it
  while in other pages we have cancelled it byt setting it to false.*/
  $ionicNavBarDelegate.showBackButton(true);
  
  //used stateParams to access clientId which allows us to navigate to each client's detail page.
  $scope.selectedClient = Clients.getById($stateParams.clientId);
  
  //create functions to show and hide different subpages based on active segmented controls
   $scope.selectedIndex = 0;
   $scope.buttonClicked = function(index){
      $scope.selectedIndex = index;
      $scope.$apply();
    }    

   $scope.editClient = function(selectedClient){
   //Change the format of kids birthday to a date object so it can be edited
   // selectedClient.kids.kidBirthdate
    $state.go('tab.edit-client', { clientId: $stateParams.clientId });
   }

}])

.controller('NewClientCtrl',["$scope", "$state","Clients", "$ionicNavBarDelegate", "$cordovaCamera",
 function($scope, $state, Clients, $ionicNavBarDelegate, $cordovaCamera) {
  $ionicNavBarDelegate.showBackButton(false);
   $scope.selectedIndex = 0;
   $scope.buttonClicked = function(index){
      $scope.selectedIndex = index;
      $scope.$apply();
    }
    $scope.formIsIncomplete = function(){
      return true;
    }
    $scope.cancelNewClient = function () {
        $state.go("tab.clients");
    };

    $scope.newClient = {
      clientDesc:"The ",
      clientId: "",
      parents:
      {
        parentFirstname:"",
        parentLastname:"",
        parentNotes:"",
        parentStreet:"",
        parentUnit:"",
        parentCity:"",
        parentState:"",
        parentZipcode:"",
        parentPrimaryphone:"",
        parentSecondaryphone:"",
        parentEmailid:""
      },
      kids:
      {
        kidFirstname:"",
        kidLastname:"",
        kidBirthdate:"",
        kidGender:"",
        kidNotes:"",
        kidPicture:""
        
      },
      tasks:
      {
        taskTitle:"",
        taskDescription:"",
        taskStartdate:"",
        taskEnddate:"",
        taskStarttime:"",
        taskEndtime:"",
        taskNotes:""
      },
      allergies:
      {
        allergyDescription:""

      },
      disabilities:
      {
        disabilityDescription:""
      },
      medications:
      {
        medicationDescription:""
      },
    };

    $scope.saveNewClient = function (data) {
        Clients.createNewClient($scope.newClient);
        console.log("inside saveNewClient ");
        $state.go("tab.clients");

    };
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
            alert("Sorry cannot take photo right now!!");
        });
    }

}])
.controller('EditClientCtrl', ["$scope", "Clients", "$state", "$stateParams",
 function($scope, Clients, $state, $stateParams) {
  console.log("EditClientsCtrl is loaded");
  //repeated code to handle segmented controls loading
  $scope.selectedIndex = 0;
   $scope.buttonClicked = function(index){
      $scope.selectedIndex = index;
      $scope.$apply();
    }
  
  $scope.editedClient = Clients.getById($stateParams.clientId);
    console.log($scope.editedClient);
    $scope.saveEditedClient= function(){
      Clients.editClient($scope.editedClient);
          console.log("inside editClient ");
          $state.go("tab.clients");

    };
  $scope.cancelEditedClient = function(){
    $state.go("tab.clients");
  };
  
  
}]);