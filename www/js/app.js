var db = null;
angular.module('SitterAdvantage',
               ['ionic', 'SitterAdvantage.clientControllers', 'SitterAdvantage.clientServices',
                'ti-segmented-control','SitterAdvantage.taskServices',
                'SitterAdvantage.taskControllers','SitterAdvantage.emergencyControllers',
                'SitterAdvantage.emergencyServices', 'SitterAdvantage.resourcesControllers','SitterAdvantage.dbService','ngCordova'])

.run(function(Tasks, Clients, dbService,$ionicPlatform, $cordovaSQLite) {
  
    $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                     cordova.plugins.Keyboard.disableScroll(true);
                     
        }
    
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    
    if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve               
            db = window.sqlitePlugin.openDatabase({ "name": "sitter.db" }); //device - SQLite
            //alert("device db (SQLite) loaded");
        } else {

            db = window.openDatabase("BabySitter", "1.0", "sitter.db", 100 * 1024 * 1024); // browser webSql, a fall-back for debugging
            //alert("browser db (WebSQL) loaded");
        }
            
    if (db) {
      
      console.log("db should have been opened at this step");
            dbService.createTables();
            dbService.insertTestData();
            //Tasks.loadFromDB();
            //Clients.loadFromDB();
    }
    });
})


.config(function ($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider) {

  //inappbrowser to allow loading the website pages within the resource tab
  // var defaultOptions = {
  //   location: 'no',
  //   clearcache: 'no',
  //   toolbar: 'yes'
  // };

  // $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);

  //using state provider to route the different pages in the app
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.tasks', {
      url: '/tasks',
      views: {
        'tab-tasks': {
          templateUrl: 'templates/tab-tasks.html',
          controller: 'TaskCtrl'
        }
      }
    })
    .state('tab.new-task', {
      url: '/newTask',
        params:{
          pageFrom : 1 // from Task
        },
      views: {
        'tab-tasks': {
          templateUrl: 'templates/new-task.html',
          controller: 'NewTaskCtrl'
        }
      }
    })

      .state('tab.new-task_client', {
          url: '/newTask',
          params:{
              pageFrom : 2, // from client,
              clientId : 1
          },
          views: {
              'tab-clients': {
                  templateUrl: 'templates/new-task.html',
                  controller: 'NewTaskCtrl'
              }
          }
      })
    .state('tab.task-detail', {
      url: '/tasks/:taskId',
        params:{
            pageFrom : 1 // from Task
        },
      views: {
        'tab-tasks': {
          templateUrl: 'templates/task-detail.html',
          controller: 'TasksDetailCtrl',
          title: 'Task Details'
        }
      }
    })

      .state('tab.task-detail_client', {
          url: '/tasks/:taskId',
          params:{
              pageFrom : 2 // from client
          },
          views: {
              'tab-clients': {
                  templateUrl: 'templates/task-detail.html',
                  controller: 'TasksDetailCtrl',
                  title: 'EDIT Task'
              }
          }
      })

  .state('tab.clients', {
      url: '/clients',
      views: {
        'tab-clients': {
          templateUrl: 'templates/tab-clients.html',
          controller: 'ClientsCtrl'
        }
      }
    })
    .state('tab.client-detail', {
      url: '/clients/:clientId',
      views: {
        'tab-clients': {
          templateUrl: 'templates/client-detail.html',
          controller: 'ClientDetailCtrl'
        }
      }
    })
    
    .state('tab.edit-parent', {
      url: '/editParent/:parentId',
      views: {
        'tab-clients': {
          templateUrl: 'templates/edit-parent.html',
          controller: 'EditParentCtrl'
        }
      }
    })

     .state('tab.edit-kid', {
      url: '/editKid/:kidId',
      views: {
        'tab-clients': {
          templateUrl: 'templates/edit-kid.html',
          controller: 'EditKidCtrl'
        }
      }
    })

          .state('tab.new-parent', {
      url: '/editClient/new-parent',
              params:{
                  clientId: 1
              },
      views: {
        'tab-clients': {
          templateUrl: 'templates/new-parent.html',
          controller: 'NewParentCtrl'
        }
      }
    })
           .state('tab.new-kid', {
      url: '/editClient/new-kid',
               params:{
                   clientId: 1
               },
      views: {
        'tab-clients': {
          templateUrl: 'templates/new-kid.html',
          controller: 'NewKidCtrl'
        }
      }
    })

  .state('tab.emergency', {
      url: '/emergency',
      views: {
        'tab-emergency': {
          templateUrl: 'templates/tab-emergency.html',
          controller: 'EmergencyCtrl'
        }
      }
    })
    .state('tab.resources', {
      url: '/resources',
      views: {
        'tab-resources': {
          templateUrl: 'templates/tab-resources.html',
          controller: 'ResourcesCtrl'
        }
      }
    })
    .state('tab.potential-job-checklist', {
      url: '/resources/resourcesId',
      views: {
        'tab-resources': {
          templateUrl: 'templates/potential-job-checklist.html'
        }
      }
    })
    .state('tab.location-checklist', {
          url: '/resources/locationId',
          views: {
            'tab-resources': {
              templateUrl: 'templates/location-checklist.html'
            }
          }
        })
    .state('tab.pre-job-checklist', {
          url: '/resources/prejobId',
          views: {
            'tab-resources': {
              templateUrl: 'templates/pre-job-checklist.html'
            }
          }
        })


    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tasks');

});