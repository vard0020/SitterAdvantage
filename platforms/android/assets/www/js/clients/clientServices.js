angular.module('SitterAdvantage.clientServices', [])

.factory('Clients', ['dbService',function(dbService) {
  var clients = [];
  var selectedClient = {}; 
  var newClient = {};
  var editedClient = {};
  var clientId;
  
  //This function will display errors from all sql statements sent to database
  var queryErrorCallback = function (err) {
     console.log("select statement failed");
     console.error(err);
  };
  //this function gets the kids names to display in client list tab
  var getKids = function(id, client_index){
    var query = "SELECT k.kidId, k.kidFirstname FROM kids k WHERE k.clientId = ?";
    var querySuccessCallback = function(tx, res) {
        console.log("select statement for kids of single client succeeded");
        console.log( "kids count " + res.rows.length );
        var kids = [];
        for (var k = 0; k < res.rows.length; k++){     
            kids.push(res.rows.item(k));
        }
        clients[client_index].kids = kids;
    };

    dbService.executeStatement(query,[id], querySuccessCallback, queryErrorCallback );    
  };
  //load all the data from the database to display in all tabs
  var loadFromDB = function(){
    var query = "SELECT clientId, clientDesc FROM clients";
    var querySuccessCallback = function(tx, res) {
        console.log("select statement for clients succeeded");
        console.log( "clients count " + res.rows.length );
        console.log(res);

        for (var c = 0; c < res.rows.length; c++){
            console.log(res.rows.item(c));
            console.log("client: " + res.rows.item(c).clientId);
            clients.push({
                'clientId':res.rows.item(c).clientId,
                'clientDesc':res.rows.item(c).clientDesc,
                'kids': []
            });
            getKids(res.rows.item(c).clientId, c);
        }
    };

    dbService.executeStatement(query,[], querySuccessCallback, queryErrorCallback );
    
  };
  //----------------------------------  Client Detail view --------------------------------------
  var getKidsForClient = function(id){

    var query = "SELECT * FROM kids k WHERE k.clientId = ?";
    var querySuccessCallback = function(tx, res) {
        console.log("select statement for kids of single client succeeded");
        console.log( "kids count " + res.rows.length );
        selectedClient.kids = [];
        for (var k = 0; k < res.rows.length; k++){
            selectedClient.kids.push(res.rows.item(k));
        }
        console.log(selectedClient.kids);      
    };

    dbService.executeStatement(query,[id], querySuccessCallback, queryErrorCallback );
  };
  
  var getParentsForClient = function(id){
    var query = "SELECT * FROM parents p WHERE p.clientId = ?";
    var querySuccessCallback = function(tx, res) {
        console.log("select statement for parents of single client succeeded");
        console.log( "parents count " + res.rows.length );
        console.log(res);

        selectedClient.parents = [];
        for (var m = 0; m < res.rows.length; m++) {
          
          selectedClient.parents.push(res.rows.item(m));
        }      
    };

    dbService.executeStatement(query,[id], querySuccessCallback, queryErrorCallback );
  };

  var getTasksForClient = function(id) {
    var query = "SELECT * FROM tasks t WHERE t.clientId = ?";
    var querySuccessCallback = function(tx, res) {
        console.log("select statement for tasks of single client succeeded");
        console.log( "tasks count " + res.rows.length );
        console.log(res);

        selectedClient.tasks = [];
        for (var n = 0; n < res.rows.length; n++) {
          selectedClient.tasks.push(res.rows.item(n));
        }
        console.log(selectedClient.tasks);      
    };
    dbService.executeStatement(query,[id], querySuccessCallback, queryErrorCallback );
  };

  /*This function calls all the functions above to load the client details for
   the segmented controls including kids, parents, tasks for each selected client  */
  var getById = function(clientId) {

    if (clientId <= clients.length) {
      
      angular.copy(clients[clientId],selectedClient);
      
      getKidsForClient(clientId);

      getParentsForClient(clientId);

      getTasksForClient(clientId);      

      return selectedClient;

    } else {
      return {};
    }
  };

  /* ---------------------------------------------------------------
  ____________________Insert new client ____________________________
  /* --------------------------------------------------------------------------------------------------
  this one funcion gets called when save button for new client is called. it calls all insert functions
   to add all client info to database. The param we pass is the new client object that takes the values from 
   the scope added by the user */
  var createNewClient = function(newClientInfo) {
      newClient = newClientInfo;
      newClient.clientDesc = newClient.clientDesc + newClient.parents.parentLastname + " Family";
      addNewClient([newClient.clientDesc]);
  };

  //Save data for each new client including kid, parent and tasks */
  var addNewClient = function(params) {
    var query = "INSERT INTO clients (clientDesc) VALUES (?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding a newClient succeeded");
        console.log(res);  
        console.log(res.insertId);   
        // get client id for new client after adding it.
        clientId = res.insertId; 
        //After getting client id, now i can add parent, kid, task info
      addParentInNewClient(
        [
          newClient.parents.parentFirstname,
          newClient.parents.parentLastname,
          newClient.parents.parentNotes,
          newClient.parents.parentStreet,
          newClient.parents.parentUnit,
          newClient.parents.parentCity,
          newClient.parents.parentState,
          newClient.parents.parentZipcode,
          newClient.parents.parentPrimaryphone,
          newClient.parents.parentSecondaryphone,
          newClient.parents.parentEmailid,
          clientId
        ]);

      addkidInNewClient(
        [
          newClient.kids.kidFirstname,
          newClient.kids.kidLastname,
          newClient.kids.kidBirthdate,
          newClient.kids.kidGender,
          newClient.kids.kidNotes,
          newClient.kids.kidPicture,
          clientId
        ]);

      addTaskInNewClient(
        [
        newClient.tasks.taskTitle,
        newClient.tasks.taskDescription,
        newClient.tasks.taskStartdate,
        newClient.tasks.taskEnddate,
        newClient.tasks.taskStarttime,
        newClient.tasks.taskEndtime,
        newClient.tasks.taskNotes,
        clientId
        ]);

      newClient.id = clientId;
    };
    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addParentInNewClient = function(params) {
    var query = "INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding parent to newClient succeeded");
        console.log(res);     
    };

    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addkidInNewClient = function(params) {
    var query = "INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId) VALUES (?,?,?,?,?,?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding new kid to newClient succeeded");
        console.log(res); 
        kidId = res.insertId;
        addAllergiesInNewClient(
        [
         newClient.allergies.allergyDescription,
         kidId
        ]);   
        addDisabilitiesInNewClient(
        [
         newClient.disabilities.disabilityDescription,
         kidId
        ]); 
        addMedicationsInNewClient(
        [
         newClient.medications.medicationDescription,
         kidId
        ]);  
        
        //call the function to insert the new client in the list of clients after kids info has been added to db
        InsertNewClientInList(
        newClient.id,
        newClient.clientDesc,
        newClient.kids.kidFirstname 
        );
    };
    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addTaskInNewClient = function(params) {
    var query = "INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes,clientId) VALUES (?,?,?,?,?,?,?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding new task to newClient succeeded");
        console.log(res);      
    };

    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addAllergiesInNewClient = function(params) {
    var query = "INSERT INTO allergies (allergyDescription, kidId) VALUES (?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding allergies to newClient succeeded");
        console.log(res);     
    };

    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addDisabilitiesInNewClient = function(params) {
    var query = "INSERT INTO disabilities (disabilityDescription, kidId) VALUES (?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding Disabilities to newClient succeeded");
        console.log(res);     
    };
    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

  var addMedicationsInNewClient = function(params) {
    var query = "INSERT INTO medications (medicationDescription, kidId) VALUES (?,?)";
    var querySuccessCallback = function(tx, res) {
        console.log("insert statement for adding Medications to newClient succeeded");
        console.log(res);     
    };
    dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  };

   //push the new client info to the client list tab after adding it to the database
  var InsertNewClientInList = function(id,desc,kidName){
    console.log("should add new client to list of clients");
    clients.push({
      'clientId':id,
        'clientDesc':desc,
        'kids':  [{ kidFirstname: kidName}]
    });

  };  

   /* ---------------------------------------------------------------
  ____________________Update/Edit new client ____________________________
  Update data for each new client including kid, parent and tasks */
  var editClient = function(newClientInfo) {
      editedClient = newClientInfo;
      editedClient.description = newClient.description + editedClient.parents.lastName + " Family";
      updateEditedClient(editedClient);
  };
   //update client table
  var updateEditedClient = function(newClientInfo) {
    var description = newClientInfo.description;
    var id = newClientInfo.clientId;
    var query = 'UPDATE clients SET clientDesc= ? WHERE clientId=?';
    var querySuccessCallback = function(tx, res) {
        console.log("update statement for updating a Client succeeded");
        console.log(res); 
    }; 
    dbService.executeStatement(query,[description, id], querySuccessCallback, queryErrorCallback );
  };

  //update client table
  // var updateParent = function(params) {
  //   var query = 'UPDATE parents SET parentFirstname=?, parentLastname=?, parentNotes=?, parentStreet=?, parentUnit=?, parentCity=?, parentState=?, parentZipcode=?, parentPrimaryphone=?, parentSecondaryphone=?, parentEmailId=?, clientId=?, WHERE parentId=” + parentId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("insert statement for adding parent to newClient succeeded");
  //       console.log(res);     
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };

  // var updateKid = function(params) {
  //   var query = '“UPDATE kids SET kidFirstname=” + kidFirstname + “, kidLastname=” + kidLastname + “, kidBirthdate=” + kidBirthdate + “, kidGender=” + kidGender + “, kidNotes=” + kidNotes + “, kidPicture=” + kidPicture + “, clientId=” + clientId + “ WHERE kidId=” + kidId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("update statement for adding new kid succeeded");
  //       console.log(res); 
  //       kidId = res.insertId;
  //       addAllergiesInNewClient(
  //       [
  //        newClient.allergies.description,
  //        kidId
  //       ]);   
  //       addDisabilitiesInNewClient(
  //       [
  //        newClient.disabilities.description,
  //        kidId
  //       ]); 
  //       addMedicationsInNewClient(
  //       [
  //        newClient.medications.description,
  //        kidId
  //       ]);  
        
  //       //call the function to insert the new client in the list of clients after kids info has been added to db
  //       InsertNewClientInList(
  //       newClient.id,
  //       newClient.description,
  //       newClient.kids.firstName  
  //       );
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };
  // var updateTask = function(params) {
  //   var query = '“UPDATE task SET taskTitle=” + taskTitle + “, taskDescription=” + taskDescription + “, taskStartdate=” +taskStartdate + “, taskEnddate=” + taskEnddate + “, taskStarttime=” + taskStarttime + “, taskEndtime=” + taskEndtime + “, taskNotes=” + taskNotes + “, clientId=” + clientId + “ WHERE taskId=” + taskId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("update statement for adding new task succeeded");
  //       console.log(res);      
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };


  // var updateAllergies = function(params) {
  //   var query = '“UPDATE allergies SET allergyDescription=” + allergyDescription + “, kidId=” + kidId + “ WHERE allergyId=” + allergyId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("insert statement for adding allergies to newClient succeeded");
  //       console.log(res);     
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };
  // var addDisabilities = function(params) {
  //   var query = '“UPDATE disabilities SET disabilityDescription=” + disabilityDescription + “, kidId=” + kidId + “ WHERE disabilityId=” + disabilityId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("insert statement for adding Disabilities to newClient succeeded");
  //       console.log(res);     
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };
  // var addMedications = function(params) {
  //   var query = '“UPDATE medications SET medicationDescription=” + medicationDescription + “, kidId=” + kidId + “ WHERE medicationId=” + medicationId';
  //   var querySuccessCallback = function(tx, res) {
  //       console.log("insert statement for adding Medications to newClient succeeded");
  //       console.log(res);     
  //   };

  //   dbService.executeStatement(query,params, querySuccessCallback, queryErrorCallback );
  // };
  //  //push the new client info to the client list tab after adding it to the database
  // var InsertNewClientInList = function(id,desc,kidName){
  //   console.log("should add new client to list of clients");
  //   clients.push({
  //     'clientId':id,
  //       'clientDesc':desc,
  //       'kids':  [{ kidFirstname: kidName}]
  //   });

  // }  ; 
  return {
    loadFromDB: loadFromDB,
    all: function() {
      return clients;
    },
    remove: function(client) {
      clients.splice(clients.indexOf(client), 1);
    },
    getById: getById,
    hasAlert: function(){
      return true;
    },
    createNewClient: createNewClient,
    editClient: editClient

  };
}]);
