angular.module('SitterAdvantage.clientControllers', [])
    .controller('ClientsCtrl', ["$scope", "Clients", "$ionicPopup", "$state",
 function ($scope, Clients, $ionicPopup, $state) {

            console.log("ClientsCtrl is loaded");
            $scope.clients = [];


            // Insert client in database
            Clients.getClientsList().then(function (clientList) {
                if (!clientList) return;
                console.log(clientList);
                //$scope.clients = clientList;

                //Get kids
                $scope.getKidsForClient(clientList)
            });

            //Get kids for client
            $scope.getKidsForClient = function (clientsArray) {

                for (var i = 0; i < clientsArray.length; i++) {

                    var client = clientsArray[i];
                    Clients.getKidsForClient(client).then(function (clientWithKids) {

                        $scope.clients.push(clientWithKids);
                    });
                }
            };

            $scope.editClientDescription = function () {
                // pop up Alert box
                $scope.data = {};

                var popUp = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.menuItemText"/>',
                    title: 'Edit Client Description',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel',
                            type: 'button-light',

            },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.menuItemText) {
                                    //don't allow the user to close untill he added something in input text
                                    e.preventDefault();
                                } else {
                                    return $scope.data.menuItemText;
                                }
                            }

            }, ]

                });

                popUp.then(function (res) {
                    if (!res) return;
                    //$scope.saveClientDescription = LocalStorage.addMenuItem(res);
                });
            };

            $scope.addClient = function () {

                // pop up Alert box
                $scope.data = {};

                var popUp = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.menuItemText"/>',
                    title: 'Add Client Description',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel',
                            type: 'button-light',

            },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.menuItemText) {
                                    e.preventDefault();
                                } else {
                                    return $scope.data.menuItemText;
                                }
                            }

            }, ]

                });

                popUp.then(function (res) {
                    if (!res) return;

                    $scope.insertClient(res);

                });
            };

            $scope.insertClient = function (clientDesc) {

                // Insert client in database
                Clients.addNewClient(clientDesc).then(function (clientId) {
                    if (!clientId) return;
                    console.log(clientId)


                    $state.go("tab.client-detail", {
                        clientId: clientId
                    });
                    //$state.go("#/tab/clients/"+clientId);
                }, function (error) { //"error" --> deferred.reject(err);

                    console.log(error)
                        //error code
                });


            };

}])

.controller('ClientDetailCtrl', ["$scope", "$stateParams", "$rootScope", "Clients", "$ionicNavBarDelegate", "$state",
 function ($scope, $stateParams, $rootScope, Clients, $ionicNavBarDelegate, $state) {


        //Show nav back button
        $ionicNavBarDelegate.showBackButton(true);
        $scope.selectedClient = {};
        //used stateParams to access clientId which allows us to navigate to each client's detail page.
     
     //Get parents
         Clients.getParentsForClient($stateParams.clientId).then(function (parents) {
                if (!parents) return;
                $scope.selectedClient.parents = parents;
            });

     //Get kids
        Clients.getKidsForClientWithID($stateParams.clientId).then(function (kids) {
                if (!kids) return;
                $scope.selectedClient.kids = kids;
            });

     //Get Tasks
        Clients.getTasksForClient($stateParams.clientId).then(function (tasks) {
                if (!tasks) return;
                $scope.selectedClient.tasks = tasks;
            });
                                                              
        //create functions to show and hide different subpages based on active segmented controls

        if (!$rootScope.segmentIndex) {

            $rootScope.segmentIndex = 0;
        }

        $scope.selectedIndex = $rootScope.segmentIndex;
        $scope.setSelectedButton = $scope.selectedIndex;

        $scope.buttonClicked = function (index) {

            $scope.updateSelection(index);

            $scope.selectedIndex = index;
            $rootScope.segmentIndex = index;
            $scope.$apply();
        }

        $scope.updateSelection = function (index) {

            //alert(index)

            if (index == 0) {

                $scope.selectedParent = true;
                $scope.selectedKid = false;
                $scope.selectedTask = false;

            } else if (index == 1) {

                $scope.selectedParent = false;
                $scope.selectedKid = true;
                $scope.selectedTask = false;

            } else if (index == 2) {

                $scope.selectedParent = false;
                $scope.selectedKid = false;
                $scope.selectedTask = true;
            }

        }

        $scope.$on('$viewContentLoaded', function () {

            $scope.updateSelection($scope.selectedIndex);
            $scope.$apply();
            //Here your view content is fully loaded !!
        });

        //handler for editing parent information
        $scope.editParent = function ($index) {
            $state.go("tab.edit-parent", {
                parentId: $scope.selectedClient.parents[$index].parentId
            });
        }

        //handler for editing kid information
        $scope.editKid = function ($index) {
            $state.go("tab.edit-kid", {
                kidId: $scope.selectedClient.kids[$index].kidId
            });
            $ionicNavBarDelegate.showBackButton(false);
        }

        //handler for editing task information
        $scope.editTask = function ($index) {
            $state.go("tab.task-detail_client", {
                taskId: $scope.selectedClient.tasks[$index].taskId
            });
        }

        //handler for adding new task
        $scope.addNewTask = function () {

            $state.go("tab.new-task_client", {
                clientId: $stateParams.clientId
            });
        }

        //handler for adding new parent
        $scope.addNewParent = function () {

            $state.go("tab.new-parent");
        }

        //handler for adding new kid
        $scope.addNewKid = function () {
            $state.go("tab.new-kid");
        }

        $scope.editClient = function (selectedClient) {
            //Change the format of kids birthday to a date object so it can be edited
            // selectedClient.kids.kidBirthdate
            $state.go('tab.edit-client', {
                clientId: $stateParams.clientId
            });
        }

}])

.controller('EditParentCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state", "$ionicHistory",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $state, $ionicHistory) {

        $ionicNavBarDelegate.showBackButton(false);
     
      Clients.getParentById($stateParams.parentId).then(function (parent) {
                if (!parent) return;
                $scope.parent = parent;
            });
     
        $scope.saveParent = function () {

            $ionicHistory.goBack();
        }

        $scope.cancelParent = function () {

            $ionicHistory.goBack();
            $ionicNavBarDelegate.showBackButton(true);

        }

        $scope.deleteParent = function () {
            alert("deleted");
        }

}])

.controller('EditKidCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state", "$ionicActionSheet", "$ionicHistory",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $state, $ionicActionSheet, $ionicHistory) {

        $scope.saveKid = function () {

            $ionicHistory.goBack();
            //Note: after going to client-details we should land on kid segmented control, (ng-switch when =1 ) instead of parent
        }
        
        Clients.getKidById($stateParams.kidId).then(function (kid) {
                if (!kid) return;
                $scope.kid = kid;
            });

        $scope.cancelKid = function () {

            $ionicHistory.goBack();

            $ionicNavBarDelegate.showBackButton(true);
            //Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
        }

        $scope.deleteKid = function () {
            alert("deleted");
            $state.go("tab.client-detail");
            //Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
        }

        $scope.editKidPicture = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {
                        text: 'Take Photo'
                    },
      ],
                destructiveText: 'Delete Photo',
                cancelText: 'Cancel',

                cancel: function () {
                    hideSheet();
                },
                buttonClicked: function (index) {
                    //code for taking a new photo
                    return true;
                },

                destructiveButtonClicked: function () {
                    hideSheet();
                }
            });
        }

}])

.controller('NewParentCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state", "$ionicHistory",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $state, $ionicHistory) {

        $ionicNavBarDelegate.showBackButton(false);

        $scope.saveParent = function () {
            $ionicHistory.goBack();
        }

        $scope.cancelParent = function () {
            $ionicHistory.goBack();
        }


}])

.controller('NewKidCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$state", "$ionicHistory",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $state, $ionicHistory) {

        $ionicNavBarDelegate.showBackButton(false);

        $scope.saveKid = function () {
            $ionicHistory.goBack();
        }

        $scope.cancelKid = function () {
            $ionicHistory.goBack();
        }

}]);