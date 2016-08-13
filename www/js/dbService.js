angular.module('SitterAdvantage.dbService', [])

.factory('dbService', function() {

	//---------------------- function responsible to create all the tables once ----------------------
	var createTables = function(){
	  db.transaction(function(tx) {
	  	//    tx.executeSql("DROP TABLE clients");
	  	//    tx.executeSql("DROP TABLE parents");
	  	//    tx.executeSql("DROP TABLE tasks");
	  	//    tx.executeSql("DROP TABLE kids");
         // tx.executeSql("DROP TABLE disabilities");
         // tx.executeSql("DROP TABLE medications");
         // tx.executeSql("DROP TABLE allergies");

	      tx.executeSql("CREATE TABLE IF NOT EXISTS clients (clientId integer primary key , clientDesc text)",[], function(){}, function(){});
	      tx.executeSql("CREATE TABLE IF NOT EXISTS parents(parentId integer primary key , parentFirstname text, parentLastname text, parentStreet text, parentUnit text, parentCity text, parentState text, parentZipcode text, parentPrimaryphone text, parentSecondaryphone text, parentEmailid text, parentNotes text, clientId integer)",[], function(){}, function(){});  
	      tx.executeSql("CREATE TABLE IF NOT EXISTS tasks(taskId integer primary key , taskTitle text, taskDescription text, taskStartdate numeric, taskEnddate numeric, taskStarttime numeric, taskEndtime numeric, taskNotes text,clientId integer, kidId integer)" , [], function(){}, function(){});
	      tx.executeSql("CREATE TABLE IF NOT EXISTS kids(kidId integer primary key, kidFirstname text, kidLastname, kidBirthdate numeric, kidGender text, kidPicture text, kidNotes text,clientId integer, allergyDescription text,disabilityDescription text, medicationDescription text)" , [], function(){}, function(){});
          
	  },

	  function(){
	    console.error("Failed to create tables into database ");
	  });
	};

   //------------------------ function used to create and delete fake data ---------------------------
	var insertTestData = function(){
	  console.log("data is going to be inserted into db");
	  db.transaction(function(tx){
	  	//Delete all test data
	    tx.executeSql("DELETE FROM clients", []);
	    tx.executeSql("DELETE FROM parents", []);
	    tx.executeSql("DELETE FROM kids", []);
	    tx.executeSql("DELETE FROM tasks", []);
	    
	    //3 clients
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Smith Family"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Jones Family"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Jetsons Family"], function(){ }, function(){});
	    //5 parents
	    tx.executeSql("INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
	      ["Maria","Smith","Primary Guardian – Custody","10 Jones Street","","Erie","Pennsylvania","23877","613-574-5893","613-584-6839","maria.smith@gmail.com","1"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
	      ["John","Smith","Divorced – allowed contact with kids","77 King Street","","Erie","Pennsylvania","23767","287-456-6812","288-433-6691","john.smith@gmail.com.com","1"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
	      ["Mack","Jones","","100 Arthur Street","","Los Angeles","California","90125","623-546-5582","623-543-5571","mack.jones@hotmail.com","2"], function(){}, function(){});
	    tx.executeSql("INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
	      ["Francine","Jones","","100 Arthur  Street","","Los Angeles","Californa","90125","612-335-5199","614-445-8923","Francine.jones@hotmail.com","2"], function(){}, function(){});
	    tx.executeSql("INSERT INTO parents (parentFirstname, parentLastname, parentNotes, parentStreet, parentUnit, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
	      ["George","Jetson","Single Dad - Custody","990 Pluto Drive Street","","Denver","Collorado","23567","683-559-2295","165-345-4451","george.jetsen@gmail.com","3"], function(){ }, function(){});
	
	    //6 kids
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,  allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Rohn", "Smith", "2011-03-12", "Male", "No iPads or phones allowed", "Rohn.jpg", "1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Samuel", "Smith", "17/June/2006", "Male", "Video games off at 8:00", "Samuel.jpg", "1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Jane", "Smith", "09/March/2008", "Female", "Sensitive to high volume sounds or music", "Jane.jpg","1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Fred", "Jones", "06/July/2011", "Male", "Limit watching TV to 2 hours maximum.", "Fred.jpg", "2","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Judy", "Jetson", "12/12/2012", "Female", "She likes reading books.", "Judy.jpg", "3","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidFirstname, kidLastname, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Robert", "Jetson", "11/October/2015", "Male", "No meat is allowed", "Robert.jpg","3","","",""], function(){}, function(){});
	    //4 tasks

	    console.log("----- TASK -----");

	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Lunch for Rohn","Nutritious lunch with a blend of vegetables", "2016/03/28","2016/03/28","12:00 pm", "01:00 pm","Favourite vegetables: Avocado, Potatoes and Tomatoes","1","1"], function(res){ }, function(error){ });
	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Homework for Samuel","Help Samuel complete all his homework", "2016/03/29","2016/03/29","03:00 pm", "05:30 pm","Homework details: Read a short story and complete 3 exercises","1","2"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Drawing time for Jane","Prepare crayons and an album for Jane and give her some picture to duplicate", "2016/03/30","2016/03/30","10:00 am", "11:30 am","Help her to start and make sure to check her progress","1","3"], function(){}, function(){});
	     tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Play time for Judy","Help Judy decorate her dollhouse", "2016/03/30","2016/03/30","01:00 pm", "03:00 pm","Ask her to bring all her furniture for dollhouse","3","5"], function(){ }, function(){});
	      tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Babysit Robert","Give him dinner and put him to sleep", "2016/04/15","2016/04/15","05:40 pm", "08:00 pm","Do not let Robert fall asleep on the sofa.","3","6"], function(){ }, function(){});
	      tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["iPad game time for Fred","Give iPad to Fred for 1 hour to play a game.", "2016/04/15","2016/04/15","05:00 pm", "06:00 pm","Make sure he has finished his dinner and monitor the time","2","4"], function(){}, function(){});
	  }, 
	    function(){
	      console.error("Failed to insert items into database");   
	  });	
	};

	//function to be used in all services to execute sql statements
	var executeStatement = function(query, params , sucessCallback, errorCallback){
		if (db) {		
			db.transaction(function(tx) {
		  		tx.executeSql(query, params, sucessCallback, errorCallback)
		  	});
		}else{
			console.error("db is not opened");
		}
	};

	return{
		createTables: createTables,
		insertTestData:insertTestData,
		executeStatement: executeStatement
	}
});