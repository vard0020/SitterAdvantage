var db = null;
angular.module('SitterAdvantage', 
  ['ionic', 'SitterAdvantage.clientControllers', 'SitterAdvantage.clientServices',
  'ti-segmented-control','SitterAdvantage.taskServices',
  'SitterAdvantage.taskControllers','SitterAdvantage.emergencyControllers',
   'SitterAdvantage.emergencyServices', 'SitterAdvantage.resourcesControllers','SitterAdvantage.dbService','ngCordova'])

.run(function($ionicPlatform, Tasks, Clients, dbService) {
  $ionicPlatform.ready(function() {
    console.log("receiving device is ready from cordova");
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
                       
  if (ionic.Platform.isWebView()) {
      db = window.sqlitePlugin.openDatabase({ name: "my2.db", iosDatabaseLocation: 'default'}); //device
                       
   // db = window.sqlitePlugin.openDatabase({name: "my.db", location: 2, createFromLocation: 1});
   }else{
     db = window.openDatabase("sitter.db", '1', 'Sitter Database', 1024 * 1024 * 10); // browser
  }

  if (db) {
    console.log("db should have been opened at this step");
    dbService.createTables();
    dbService.insertTestData();
    Tasks.loadFromDB();
    Clients.loadFromDB();
  }
  });
})


.config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider) {
   
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
        controller: 'UpcomingTasksCtrl'
      }
    }
  })
   .state('tab.new-task', {
      url: '/newTask',
      views: {
        'tab-tasks': {
          templateUrl: 'templates/new-task.html',
            controller: 'NewTaskCtrl'
        }
      }
    })
  .state('tab.task-detail', {
     url: '/tasks/:taskId',
    // params: {
    //   'client_id': '1', 
    //   'task_id': '1'
    // },

    views: {
      'tab-tasks': {
        templateUrl: 'templates/task-detail.html',
        controller: 'TasksDetailCtrl'
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
    .state('tab.new-client', {
      url: '/newClient',
      views: {
        'tab-clients': {
          templateUrl: 'templates/new-client.html',
          controller: 'NewClientCtrl'
        }
      }
    })
    .state('tab.edit-client', {
      url: '/editClient/:clientId',
      views: {
        'tab-clients': {
          templateUrl: 'templates/edit-client.html',
          controller: 'EditClientCtrl'
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
  .state('tab.resources-detail', {
    url: '/resources/resourcesId',
    views: {
      'tab-resources': {
        templateUrl: 'templates/checklist.html',
        controller: 'ResourcesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tasks');

});
