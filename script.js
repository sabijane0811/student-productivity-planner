
var taskInput = document.getElementById("taskInput");
var subjectInput = document.getElementById("subjectInput");
var dueDate = document.getElementById("dueDate");
var addButton = document.getElementById("addButton");
var taskList = document.getElementById("taskList");
var progressText = document.getElementById("progressText");
var percentageText = document.getElementById("percentageText");
var taskFilter = document.getElementById("taskFilter");

// Load previously saved tasks
var savedTasks = localStorage.getItem("studentPlannerTasks");
var tasks = [];

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
}

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem(
        "studentPlannerTasks",
        JSON.stringify(tasks)
    );
}

function displayTasks() {
    taskList.innerHTML = "";

    var completed = 0;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done) {
            completed++;
        }
    }

    var pending = tasks.length - completed;
    var percentage = 0;

    if (tasks.length > 0) {
        percentage = Math.round(
            (completed / tasks.length) * 100
        );
    }

    progressText.textContent =
        "Total: " + tasks.length +
        " | Completed: " + completed +
        " | Pending: " + pending;

    percentageText.textContent =
        "Completion: " + percentage + "%";

    for (var i = 0; i < tasks.length; i++) {
        if (taskFilter.value === "pending" && tasks[i].done) {
            continue;
        }

        if (taskFilter.value === "completed" && !tasks[i].done) {
            continue;
        }

        var li = document.createElement("li");
        li.className = "task-row";

        var check = document.createElement("input");
        check.type = "checkbox";
        check.checked = tasks[i].done;
        check.dataset.index = i;

        var details = document.createElement("div");
        details.className = "task-name";

        var name = document.createElement("span");
        name.textContent = tasks[i].name;

        if (tasks[i].done) {
            name.className = "completed";
        }

        var info = document.createElement("span");
        info.className = "task-details";
        info.textContent =
            tasks[i].subject + " | Due: " + tasks[i].date;

        details.appendChild(name);
        details.appendChild(info);

        check.onchange = function() {
            var index = Number(this.dataset.index);
            tasks[index].done = this.checked;
            saveTasks();
            displayTasks();
        };

        var del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "delete-button";
        del.dataset.index = i;

        del.onclick = function() {
            var index = Number(this.dataset.index);
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        };

        li.appendChild(check);
        li.appendChild(details);
        li.appendChild(del);

        taskList.appendChild(li);
    }
}

addButton.onclick = function() {
    var name = taskInput.value.trim();
    var subject = subjectInput.value;
    var date = dueDate.value;

    if (name === "") {
        alert("Please enter a task!");
        return;
    }

    if (date === "") {
        alert("Please select a due date!");
        return;
    }

    tasks.push({
        name: name,
        subject: subject,
        date: date,
        done: false
    });

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";

    displayTasks();
};

taskFilter.onchange = displayTasks;

displayTasks();
