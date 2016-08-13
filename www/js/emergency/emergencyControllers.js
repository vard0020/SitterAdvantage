
angular.module('SitterAdvantage.emergencyControllers', ['ngCordova'])
////////////////// Anna's code //////////////////
.controller('EmergencyCtrl', ["$scope", "$ionicModal", "$cordovaSms",  "GPSMap","Clients", function ($scope, $ionicModal, $cordovaSms, GPSMap,Clients) {
  console.log("entering emergency");
  $scope.sosMessage = "I am in trouble! Come home now!\n";

  $scope.settings = {
    enableFriends: true
  };
	
    // get client in database
            Clients.getParentsForClient(1).then(function (parentList) {
                if (!parentList) return;
                $scope.parents = parentList;
            });

 
  
  var showGPS = "Show my location"; 
  var hideGPS = "Hide Map"; 
   
  var map;
  $scope.buttonText = showGPS;
  $scope.togglebtn = "show";
  $scope.mapCoords; // saves map coordinates 

   $ionicModal.fromTemplateUrl('templates/tab-emergency-map.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
        
  });
    

$scope.mapCoords = {
    lat: 0,
    lng: 0  
  }
 

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.showModal = function(){
      $scope.showStaticMap();
          $scope.modal.show();
  };
  
  $scope.showStaticMap = function(){
  
        
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.mapCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        //var url = "https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.mapCoords.lat + "," + $scope.mapCoords.lng + "&zoom=14&size=400x400&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222key=AIzaSyCezZBLJ125BLFZNSAkbGMdEr9to010Cbk";
        //var url = "https://maps.googleapis.com/maps/api/staticmap?center=45.3024718,-75.8563826&zoom=14&size=400x400&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222key=AIzaSyCezZBLJ125BLFZNSAkbGMdEr9to010Cbk";
        var div = document.getElementById("map");
  div.innerHTML = "Loading your image...please wait!";
        var dimensions = 400; 
        var url = "https://maps.googleapis.com/maps/api/staticmap?center="
        var mapUrl = url + $scope.mapCoords.lat + "," + $scope.mapCoords.lng 
      + '&zoom=14&size=' + dimensions + 'x' + dimensions 
      + '&maptype=terrain&sensor=true&markers=size:mid%7Ccolor:red%7C' 
      + $scope.mapCoords.lat + "," + $scope.mapCoords.lng;
      console.log(mapUrl);
      
      var img = new Image;
      img.alt = "Your approximate location";
      img.height = dimensions;
      img.width = dimensions;
      img.src = mapUrl;
      // prevents the creation of multiple images if one already exists
      div.innerHTML = ""; 
      if (div.childElementCount == 0)
        div.appendChild(img);
      });
    }
  }

  // Handle geolocation errors 
  $scope.handleLocationError = function(browserHasGeolocation, infoWindow, mapCoords) {
  infoWindow.setPosition($scope.mapCoords);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  }
  
  // Sends an SMS message to the contact parents
  $scope.sendSMS = function(number) { 
    
    var success = function () { console.log('Message sent successfully'); };
    var error = function (e) { 
  //alert('Message Failed:' + e + ". Check your phone connection."); 
  // change the phone number to the number stored in database
  document.getElementById("parent1").href = "sms:6138539911&body=" + $scope.sosMessage;
  };
    var options = {
            replaceLineBreaks: true, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
    }
    
    var gpsURL = ""; 
    // If there is a location for the babysitter, send it to the parents  
    if ($scope.mapCoords.lat != 0 && $scope.mapCoords.lng != 0){
      gpsURL = "http://maps.google.com/maps?f=q&amp;geocode=&amp;q=" + $scope.mapCoords.lat + "," + $scope.mapCoords.lng + "&z=14";
      
      $scope.sosMessage += "Map: " + gpsURL;
    } else {
      gpsURL = "";  
    }
    sms.send(number, $scope.sosMessage, options, success, error);
  };
  $scope.callNumber = function(number) {
    window.open('tel:' + number, '_system');
  }

    }]);
////////////////// end of Anna's code //////////////////