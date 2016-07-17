var db;
angular.module('SitterAdvantage.taskServices', [])

.factory('Tasks', function(dbService) {
  var tasks = [];
  var taskId;
  var myTasks = {};

  var loadFromDB = function(){

    var query = "SELECT * FROM tasks t INNER JOIN clients c WHERE t.clientId = c.clientId";
    var querySuccessCallback = function(tx, res) {
       console.log("select statement for tasks succeeded");
       console.log( "task count " + res.rows.length );

       console.log(res.rows);

       for (var t = 0; t < res.rows.length; t++){
        tasks.push(res.rows.item(t));
       }

       console.log(tasks);
       // call create new task([]);
       
    };
    var queryErrorCallback = function (err) {
       console.log("select statement for tasks failed");
       console.error(err);
    };

    dbService.executeStatement(query, [], querySuccessCallback, queryErrorCallback ); 
  }


/*---------------------------------------------------------------
  ____________________Insert new task ____________________________
  Save data for each new task______________________________________ */
  var createNewTask = function(params){
        
        console.log("inside createNewTask");
        var query = "INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId) VALUES (?,?,?,?,?,?,?,?)";

        var querySuccessCallback = function(tx, res) {
          // console.log(res.insertId);   
        // // get task id for new client after adding it.
        // taskId = res.insertId; 
        console.log("insert statement for adding a newTask succeeded");  
        console.log(params.startDate);

        };

    var queryErrorCallback = function (err) {
       console.log("insert statement for tasks failed");
       console.error(err);
    };

    dbService.executeStatement(query, [params.taskTitle, params.taskDescription, params.startDate, params.endDate, params.startTime, params.endTime, params.taskNotes, params.clientId], querySuccessCallback, queryErrorCallback );
  }

  return {
    loadFromDB: loadFromDB,
    all: function() {

      //tasks.splice(0, tasks.length);
      return tasks;
    },
    remove: function(task) {
      tasks.splice(tasks.indexOf(task), 1);
    },
    get: function(taskId) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === parseInt(taskId)) {
          return tasks[i];
        }
      }
      return null;
    },
    createNewTask: createNewTask
  };

});