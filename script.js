

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const filters = document.querySelectorAll(".filter");

const taskCounter = document.getElementById("taskCounter");

const progressBar = document.getElementById("progressBar");

const clearCompleted = document.getElementById("clearCompleted");

const themeBtn = document.getElementById("themeBtn");

// ==============================
// DATA
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

// ==============================
// LOAD THEME
// ==============================

if (darkMode) {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}

// ==============================
// SAVE
// ==============================

function saveTasks() {

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}

// ==============================
// UPDATE COUNTER
// ==============================

function updateCounter() {

    const completed = tasks.filter(task => task.completed).length;

    const remaining = tasks.length - completed;

    taskCounter.textContent =
        `Total: ${tasks.length} | Completed: ${completed} | Remaining: ${remaining}`;

}

// ==============================
// UPDATE PROGRESS
// ==============================

function updateProgress() {

    const completed = tasks.filter(task => task.completed).length;

    const percent =
        tasks.length === 0
            ? 0
            : (completed / tasks.length) * 100;

    progressBar.style.width = percent + "%";

}

// ==============================
// RENDER TASKS
// ==============================

function renderTasks() {

    taskList.innerHTML = "";

    let filtered = [...tasks];

    // SEARCH

    if (searchInput.value.trim() !== "") {

        filtered = filtered.filter(task =>

            task.text

                .toLowerCase()

                .includes(searchInput.value.toLowerCase())

        );

    }

    // FILTER

    if (currentFilter === "active") {

        filtered = filtered.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filtered = filtered.filter(task => task.completed);

    }

    if (filtered.length === 0) {

        taskList.innerHTML =
            `<li class="empty">No Tasks Found</li>`;

        updateCounter();

        updateProgress();

        return;

    }

    filtered.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `

        <div class="task-left">

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-index="${index}"
                class="toggle">

            <div class="task-info">

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

                <div class="task-meta">

                    <span class="priority ${task.priority.toLowerCase()}">

                        ${task.priority}

                    </span>

                    <span class="due-date">

                        📅 ${task.date || "No Date"}

                    </span>

                </div>

            </div>

        </div>

        <div class="btn-group">

            <button
                class="edit-btn"
                data-index="${index}">
                Edit
            </button>

            <button
                class="delete-btn"
                data-index="${index}">
                Delete
            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    updateCounter();

    updateProgress();

}
// ==============================
// ADD TASK
// ==============================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    // Duplicate check
    const exists = tasks.some(task =>
        task.text.toLowerCase() === text.toLowerCase()
    );

    if (exists) {
        alert("Task already exists!");
        return;
    }

    tasks.unshift({
        text: text,
        priority: priority.value,
        date: dueDate.value,
        completed: false
    });

    saveTasks();

    renderTasks();

    todoForm.reset();

    taskInput.focus();

}

// ==============================
// DELETE TASK
// ==============================

function deleteTask(index) {

    if (!confirm("Delete this task?")) return;

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}

// ==============================
// TOGGLE COMPLETE
// ==============================

function toggleTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    renderTasks();

}

// ==============================
// EDIT TASK
// ==============================

function editTask(index) {

    const newText = prompt(
        "Edit Task",
        tasks[index].text
    );

    if (newText === null) return;

    if (newText.trim() === "") {

        alert("Task cannot be empty.");

        return;

    }

    const duplicate = tasks.some((task, i) =>

        i !== index &&
        task.text.toLowerCase() ===
        newText.toLowerCase()

    );

    if (duplicate) {

        alert("Task already exists.");

        return;

    }

    tasks[index].text = newText.trim();

    saveTasks();

    renderTasks();

}

// ==============================
// TASK EVENTS
// ==============================

taskList.addEventListener("click", function (e) {

    const index = Number(e.target.dataset.index);

    if (e.target.classList.contains("delete-btn")) {

        deleteTask(index);

    }

    if (e.target.classList.contains("edit-btn")) {

        editTask(index);

    }

});

taskList.addEventListener("change", function (e) {

    if (e.target.classList.contains("toggle")) {

        toggleTask(

            Number(e.target.dataset.index)

        );

    }

});
// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {
    renderTasks();
});

// ==============================
// FILTER
// ==============================

filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// ==============================
// CLEAR COMPLETED
// ==============================

clearCompleted.addEventListener("click", () => {

    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        alert("No completed tasks found.");
        return;
    }

    if (confirm("Delete all completed tasks?")) {

        tasks = tasks.filter(task => !task.completed);

        saveTasks();

        renderTasks();

    }

});

// ==============================
// DARK MODE
// ==============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    darkMode = document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        JSON.stringify(darkMode)
    );

    themeBtn.textContent = darkMode ? "☀️" : "🌙";

});

// ==============================
// FORM SUBMIT
// ==============================

todoForm.addEventListener("submit", function (e) {

    e.preventDefault();

    addTask();

});

// ==============================
// SORT TASKS
// ==============================

function sortTasks() {

    tasks.sort((a, b) => {

        if (a.completed === b.completed) {

            const priorityOrder = {
                High: 3,
                Medium: 2,
                Low: 1
            };

            return priorityOrder[b.priority] - priorityOrder[a.priority];

        }

        return a.completed - b.completed;

    });

}

// ==============================
// INITIALIZE
// ==============================

function init() {

    sortTasks();

    renderTasks();

    taskInput.focus();

}

init();

// ==============================
// AUTO SAVE & RENDER
// ==============================

const originalSave = saveTasks;

saveTasks = function () {

    sortTasks();

    originalSave();

};

// ==============================
// KEYBOARD SHORTCUT
// Ctrl + / Focus Search
// ==============================

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key === "/") {

        e.preventDefault();

        searchInput.focus();

    }

});

// ==============================
// ESC TO CLEAR SEARCH
// ==============================

searchInput.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        searchInput.value = "";

        renderTasks();

    }

});
