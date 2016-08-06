var db = null;
angular.module('SitterAdvantage',
               ['ionic', 'SitterAdvantage.clientControllers', 'SitterAdvantage.clientServices',
                'ti-segmented-control','SitterAdvantage.taskServices',
                'SitterAdvantage.taskControllers','SitterAdvantage.emergencyControllers',
                'SitterAdvantage.emergencyServices', 'SitterAdvantage.resourcesControllers','SitterAdvantage.dbService','ngCordova'])

.run(function(Tasks, Clients, dbService,$ionicPlatform, $cordovaSQLite) {
	
    $ionicPlatform.ready(function() {
		alert("Hi");
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                     cordova.plugins.Keyboard.disableScroll(true);
                     
        }
		
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
		
		if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve               
            db = window.sqlitePlugin.openDatabase({ "name": "sitter.db" }); //device - SQLite
            alert("device db (SQLite) loaded");
        } else {

            db = window.openDatabase("APSNetMobileDb", "1.0", "sitter.db", 100 * 1024 * 1024); // browser webSql, a fall-back for debugging
            alert("browser db (WebSQL) loaded");
        }
		
        //db = $window.sqlitePlugin.openDatabase.openDB({ name: "sitter.db" });
        //var db = window.sqlitePlugin.openDatabase({name: 'sitter.db', location: 'default'});
        
		if (db) {
                        console.log("db should have been opened at this step");
                        dbService.createTables();
                        dbService.insertTestData();
                        Tasks.loadFromDB();
                        Clients.loadFromDB();
                     }
    });

	
//ionic.Platform.ready(function(){
//    // will execute when device is ready, or immediately if the device is already ready.
//		 
//		 //alert("device is ready")
//                     
//                     if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//                     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//                     cordova.plugins.Keyboard.disableScroll(true);
//                     
//                     }
//                     if (window.StatusBar) {
//                     	StatusBar.styleDefault();
//                     }
//                     
////                     var deviceInformation = ionic.Platform.device();
////                     alert(deviceInformation);
//	
//	                 if (ionic.Platform.isWebView()) {
//                        alert("device");
//                        console.log("device");
//                        db = window.sqlitePlugin.openDatabase({ name: "sitter.db", location: 'default'}); //device
//                     }else{
//                        alert("browser");
//                        console.log("browser");
//                        db = window.openDatabase("sitter.db", '1', 'Sitter Database', 1024 * 1024 * 10); // browser
//                     }
//                     
//                     if (db) {
//                        console.log("db should have been opened at this step");
//                        dbService.createTables();
//                        dbService.insertTestData();
//                        Tasks.loadFromDB();
//                        Clients.loadFromDB();
//                     }
//  });
	
//	$ionicPlatform.ready(function() {
//		
//		alert("Hi");
//		
//	}
	
     
//     
//     $ionicPlatform.ready(function() {
//                          console.log("receiving device is ready from cordova");
//                          
//                          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//                          // for form inputs)
//                          if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//                          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//                          cordova.plugins.Keyboard.disableScroll(true);
//                          
//                          }
//                          if (window.StatusBar) {
//                          StatusBar.styleDefault();
//                          }
//		 
//		 var deviceInformation = $ionicPlatform.device();
//		 alert(deviceInformation)
//
////  var isWebView = $ionicPlatform.isWebView();  
////  var isIOS = $ionicPlatform.isIOS();
////  var isAndroid = $ionicPlatform.isAndroid();
////
////  var currentPlatform = ionic.Platform.platform();
////  var currentPlatformVersion = ionic.Platform.version();
////                          
//                          if ($ionicPlatform.isWebView()) {
//                          
//                          console.log("ionicPlatform.isWebView == tru");
//                          
//                          db = window.sqlitePlugin.openDatabase({ name: "my.db2", iosDatabaseLocation: 'default'}); //device
//                          }else{
//                          
//                          console.log("ionicPlatform.isWebView == fals");
//                          
//                          db = window.openDatabase("sitter.db", '1', 'Sitter Database', 1024 * 1024 * 10); // browser
//                          }
//                          
//                          if (db) {
//                          console.log("db should have been opened at this step");
//                          dbService.createTables();
//                          dbService.insertTestData();
//                          Tasks.loadFromDB();
//                          Clients.loadFromDB();
//                          }
//                          });
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
			views: {
				'tab-tasks': {
					templateUrl: 'templates/task-detail.html',
					controller: 'TasksDetailCtrl'
				}
			}
		})

	.state('tab.edit-task-detail', {
		url: '/tasks/edit-task-detail',
		views: {
			'tab-tasks': {
				templateUrl: 'templates/edit-task-detail.html',
				controller: 'EditTasksDetailCtrl'
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