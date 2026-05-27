const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const toggleThemeBtn = document.getElementById("toggleTheme");

let tasks = [];
let theme = localStorage.getItem("theme") || "dark";

document.body.classList.toggle("light", theme === "light");

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
});

loadTasks();
renderTasks();

button.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const text = input.value.trim();
    if (text === "") return;

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";
    saveTasks();
    renderTasks();
}

function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;

        // Mark button
        const markBtn = document.createElement("button");
        markBtn.textContent = task.completed ? "Unmark" : "Mark";
        markBtn.classList.add("mark-btn");

        markBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(markBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    updateCounter();
    checkTasks();
}

function checkTasks() {
    if (tasks.length === 0) {
        counter.textContent = "No tasks yet!"
    }
}

function updateCounter() {
    const remaining = tasks.filter(task => !task.completed).length;
    counter.textContent = `Tasks: ${remaining} of ${tasks.length} remaining`;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    try {
        const data = localStorage.getItem("tasks");
        tasks = data ? JSON.parse(data) : [];
    } catch {
        tasks = [];
    }
}
