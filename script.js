let taskListEl = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
document.getElementById('taskDate').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');

  const taskText = taskInput.value.trim();
  const dateValue = taskDate.value;

  if (!taskText) {
    alert('Please enter a task!');
    return;
  }

  const taskObj = {
    id: Date.now(),
    text: taskText,
    date: dateValue,
    done: false
  };

  saveTask(taskObj);
  renderTask(taskObj);

  taskInput.value = '';
  taskDate.value = '';
}

function renderTask(taskObj) {
  const li = document.createElement('li');
  if (taskObj.done) li.classList.add('done');

  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');
  taskContent.innerHTML = `<strong>${taskObj.text}</strong><br><small>${formatDateTime(taskObj.date)}</small>`;

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('task-buttons');

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.classList.add('edit');
  editBtn.title = "Edit Task";
  editBtn.onclick = () => {
    const newText = prompt('Edit task:', taskObj.text);
    const newDate = prompt('Edit date and time (YYYY-MM-DDTHH:MM):', taskObj.date);

    if (newText && newDate) {
      taskObj.text = newText;
      taskObj.date = newDate;
      updateTask(taskObj);
    }
  };

  const doneBtn = document.createElement('button');
  doneBtn.textContent = '✅';
  doneBtn.classList.add('done');
  doneBtn.title = "Mark as Done";
  doneBtn.onclick = () => {
    taskObj.done = !taskObj.done;
    updateTask(taskObj);
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.classList.add('delete');
  deleteBtn.title = "Delete Task";
  deleteBtn.onclick = () => {
    deleteTask(taskObj.id);
  };

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(doneBtn);
  btnContainer.appendChild(deleteBtn);

  li.appendChild(taskContent);
  li.appendChild(btnContainer);
  li.dataset.id = taskObj.id;

  taskListEl.appendChild(li);
}

function formatDateTime(datetimeStr) {
  if (!datetimeStr) return "No date";
  const options = {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  };
  return new Date(datetimeStr).toLocaleString(undefined, options);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  taskListEl.innerHTML = '';
  tasks.forEach(task => renderTask(task));
}

function updateTask(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}
