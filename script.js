const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="completeTask(${index})"
      >

      <span class="task-text ${task.completed ? "completed" : ""}">
        ${task.text}
      </span>

      <div class="btns">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    text: text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showTasks();
}

function completeTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function editTask(index) {
  const newTask = prompt("Edit your task:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask.trim();
    saveTasks();
    showTasks();
  }
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");

  darkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", darkMode);

  themeBtn.textContent = darkMode ? "☀️" : "🌙";
});

showTasks();