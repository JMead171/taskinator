var taskIdCounter = 0;
var pageContentE1 = document.querySelector('#page-content');
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");

var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var tasks = [];

// add task in header
var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    
    var isEdit = formE1.hasAttribute("data-task-id");
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
        };

    createTaskE1(taskDataObj);
    }

    formE1.reset();
  }

// move info from edit task into h3 & span into header area
var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// add task
var createTaskE1 = function(taskDataObj) {
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    console.log(taskDataObj);
    console.log(taskDataObj.status);

    // add task id as a custom attribute
    listItemE1.setAttribute("data-task-id", taskIdCounter);
    listItemE1.setAttribute("draggable", "true");

    var taskInfoE1 = document.createElement("div");
    taskInfoE1.className = "task-info";
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemE1.appendChild(taskInfoE1);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    var taskActionsE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionsE1);

    tasksToDoE1.appendChild(listItemE1);

    // increase task counter for next unique id
    taskIdCounter++;
};

// create the task in the windows with edit & delete buttons, with drop down menu
var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    var editButtonE1 = document.createElement("button"); // create edit button
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    var deleteButtonE1 = document.createElement("button"); // creat delete button
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);
    
    actionContainerE1.appendChild(deleteButtonE1);

    var statusSelectE1 = document.createElement("select"); // creat drop down menu use with select
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);
    
    var statusChoices = ["To Do", "In Progress", "Completed"];  // create choices in drop down menu
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);
      
        // append to select
        statusSelectE1.appendChild(statusOptionE1);
      }


    actionContainerE1.appendChild(statusSelectE1);
    
    return actionContainerE1;
};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formE1.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
      // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
      if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
      }
    }
    
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

};

// edit & delete buttons
var taskButtonHandler = function(event) {
    var targetE1 = event.target;    
    // edit button
    if (targetE1.matches(".edit-btn")) {
        var taskId = targetE1.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button
    else if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

// drop down selections
var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
      } 
      else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
      } 
      else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
      }
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    console.log(tasks);
    }

};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id"); 
    event.dataTransfer.setData("text/plain", taskId);

    var getId = event.dataTransfer.getData("text/plain");
  
}

var dropZoneDragHandler = function(event) {
    var taskListE1 = event.target.closest(".task-list");
    if (taskListE1) {
        event.preventDefault();
        taskListE1.setAttribute("style", "background: rgba(68, 233, 255, 07); borderStyle: dashed;");
    }
  };

  var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneE1 = event.target.closest(".task-list");
    var statusType = dropZoneE1.id;
    
    // set status of task based on dropZone id
    var statusSelectE1 = draggableElement.querySelector("select[name='status-change']");
    
    if (statusType === "tasks-to-do") {
        statusSelectE1.selectedIndex = 0;
      } 
      else if (statusType === "tasks-in-progress") {
        statusSelectE1.selectedIndex = 1;
      } 
      else if (statusType === "tasks-completed") {
        statusSelectE1.selectedIndex = 2;
      }
    dropZoneE1.removeAttribute("style");
    dropZoneE1.appendChild(draggableElement);

    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectE1.value.toLowerCase();
        }
    }
    console.log(tasks);

    };

    var dragLeaveHandler = function(event) {
       var taskListE1 = event.target.closest(".task-list");
        if (taskListE1) {
            taskListE1.removeAttribute("style");
        }
    }


formE1.addEventListener("submit", taskFormHandler); // add task button
pageContentE1.addEventListener("click", taskButtonHandler); // edit & delete button
pageContentE1.addEventListener("change", taskStatusChangeHandler);  // drop down menu
pageContentE1.addEventListener("dragstart", dragTaskHandler);
pageContentE1.addEventListener("dragover", dropZoneDragHandler);
pageContentE1.addEventListener("drop", dropTaskHandler);
pageContentE1.addEventListener("dragleave", dragLeaveHandler);