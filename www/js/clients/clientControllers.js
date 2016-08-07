angular.module('SitterAdvantage.clientControllers', [])
.controller('ClientsCtrl', ["$scope", "Clients", "$ionicPopup", "$state",
 function($scope, Clients, $ionicPopup, $state) {

  console.log("ClientsCtrl is loaded");
  $scope.clients = [];
  $scope.clients = Clients.all();
  
  
   $scope.editClientDescription = function() {
      // pop up Alert box
  
          $scope.data = {};

          var popUp = $ionicPopup.show({
            template: '<input type="text" ng-model="data.menuItemText"/>',
            title: 'Edit Client Description',
            scope: $scope,
            buttons: [
            {
              text: 'Cancel',
            },
            {
              text: '<b>Save</b>',
              type: 'button-dark',
              onTap: function (e) {
                if (!$scope.data.menuItemText) {
                  //don't allow the user to close untill he added something in input text
                  e.preventDefault();
                } else {
                  return $scope.data.menuItemText;
                }
              }
                
            },]

        });

        popUp.then(function (res) {
          if (!res) return;
          //$scope.saveClientDescription = LocalStorage.addMenuItem(res);
        });
   };

    $scope.addClient = function(){

       // pop up Alert box
          $scope.data = {};

          var popUp = $ionicPopup.show({
            template: '<input type="text" ng-model="data.menuItemText"/>',
            title: 'Add Client Description',
            scope: $scope,
            buttons: [
            {
              text: 'Cancel',
            },
            {
              text: '<b>Save</b>',
              type: 'button-dark',
              onTap: function (e) {
                if (!$scope.data.menuItemText) {
                  e.preventDefault();
                } else {
                  return $scope.data.menuItemText;
                }
              }
                
            },]

        });

        popUp.then(function (res) {
          if (!res) return;
          //$scope.addClientDescription = LocalStorage.addMenuItem(res);
          $state.go("tab.new-client");
            
        });
    
  };

}])

.controller('ClientDetailCtrl',["$scope", "$stateParams", "$rootScope", "Clients", "$ionicNavBarDelegate", "$state",
 function($scope, $stateParams, $rootScope,Clients, $ionicNavBarDelegate, $state) {

  //handler for editing parent information
  $scope.editParent = function(){
    $scope.selectedParent = {};
    $scope.selectedParent = Clients.getById($stateParams.parentId);
    $state.go("tab.edit-parent", { parentId: $stateParams.parentId } );
  }

  //handler for editing kid information
  $scope.editKid = function(){
    $scope.selectedKid = {};
    $scope.selectedKid = Clients.getById($stateParams.kidId);
    $state.go("tab.edit-kid", { kidId: $stateParams.kidId } );
    $ionicNavBarDelegate.showBackButton(false);

    
  }

  //handler for editing task information
  $scope.editTask = function(){
    $state.go("tab.task-detail");
      $scope.disableEnableForm = true;

    //we need to 
    //1. change page title
    //2. hde edit button
    //3. show cancel button
    //hide disabling
    //show delete button


  }


  $scope.selectedClient = {};
  
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

.controller('EditParentCtrl',["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state",
 function($scope, $stateParams, Clients, $ionicNavBarDelegate, $state) {

  $ionicNavBarDelegate.showBackButton(false);

  $scope.saveParent = function(){
      $state.go("tab.client-detail");
  }

  $scope.cancelParent = function(){
        
        $state.go("tab.client-detail");
        $ionicNavBarDelegate.showBackButton(true);

      }

  $scope.deleteParent = function(){
      alert("deleted");
  }

}])

.controller('EditKidCtrl',["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state", "$ionicActionSheet",
 function($scope, $stateParams, Clients, $ionicNavBarDelegate, $state, $ionicActionSheet) {

  $scope.saveKid = function(){
      $state.go("tab.client-detail");
     //Note: after going to client-details we should land on kid segmented control, (ng-switch when =1 ) instead of parent
  }

  $scope.cancelKid= function(){
        
        $state.go("tab.client-detail");
        $ionicNavBarDelegate.showBackButton(true);
        //Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
      }

  $scope.deleteKid = function(){
      alert("deleted");
      $state.go("tab.client-detail");
       //Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
  }

  $scope.editKidPicture = function(){
    // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Take Photo' },
      ],
     destructiveText: 'Delete Photo',
     cancelText: 'Cancel',

     cancel: function() {
          hideSheet();
      },
     buttonClicked: function(index) {
       //code for taking a new photo
       return true;
     },

     destructiveButtonClicked: function(){
       hideSheet();
     }
     
   });
      
  }

}])

.controller('NewClientCtrl',["$scope", "$state","Clients", "$ionicNavBarDelegate", "$cordovaCamera",
 function($scope, $state, Clients, $ionicNavBarDelegate, $cordovaCamera) {
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
    $state.go("tab.client-detail");
  };
  
  
}]);