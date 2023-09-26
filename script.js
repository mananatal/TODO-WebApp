const task = document.querySelector("#input-task");
const addTaskBtn = document.querySelector(".add-task-button");
const tasksList = document.querySelector(".task-container");
const addTaskForm = document.querySelector(".add-task-form");

let list = JSON.parse(localStorage.getItem("todos")) || [];

showTasksList();

function showTasksList() {
  tasksList.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("todos")) || [];

  list.reverse().forEach((task) => {
    const element = `
      <div class="task-delete-btn-container">
        <div class="task">
          ${task.text}
          <div class="icons">
            <div class="edit-btn"><img data-id="${task.id}" src="./assets/NotePencil.png"></div>
            <div class="complete-btn"><i data-id="${task.id}" class="fa-solid fa-check" style="color: #ffffff;"></i></div>
          </div>
        </div>
        <div class="del-btn">
          <img data-id="${task.id}" src="./assets/delbtn.svg" alt="">
        </div>
      </div>
    `;

    tasksList.insertAdjacentHTML("beforeend", element);
  });

  document.querySelectorAll('.del-btn').forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTask(+e.target.dataset.id);
    });
  });

  document.querySelectorAll('.complete-btn').forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      completeTask(+e.target.dataset.id);
    });
  });

  document.querySelectorAll('.edit-btn').forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      showEditModal(+e.target.dataset.id);
    });
  });
}

document.querySelector(".update-btn").addEventListener("click", () => {
  const id = document.querySelector("#update-input-field").dataset.id;
  editTask(+id);
});

function showEditModal(id) {
  const taskIndex = list.findIndex(t => t.id === id);
  const { text } = list[taskIndex];

  document.querySelector("#update-input-field").value = text.trim();
  document.querySelector("#update-input-field").dataset.id = id;
  openModal();
}

function editTask(id) {
  const taskText = document.querySelector("#update-input-field").value;

  if (taskText.trim().length === 0) return;

  const taskIndex = list.findIndex(t => t.id === id);
  list[taskIndex].text = taskText;

  localStorage.setItem("todos", JSON.stringify(list));

  showToastNotification("Task updated successfully!", "success");

  showTasksList();
  closeModal();
}

function showToastNotification(message, type) {
  Toastify({
    text: message,
    duration: 2000,
    close: true,
    gravity: "bottom",
    position: "right",
    backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
  }).showToast();
}

function removeTask(id) {
  list = list.filter(task => task.id !== id);
  localStorage.setItem("todos", JSON.stringify(list));
  showTasksList();
  showToastNotification("Task deleted successfully!", "error");
}

function completeTask(id) {
  list = list.filter(t => t.id !== id);
  localStorage.setItem("todos", JSON.stringify(list));
  showTasksList();
  showToastNotification("Task Completed successfully!", "success");
}

function addTask(event) {
  event.preventDefault();

  const taskText = task.value;
  if (taskText.trim().length === 0) {
    return (task.value = "");
  }

  list.push({
    id: list.length + 1,
    text: taskText,
  });
  localStorage.setItem("todos", JSON.stringify(list));
  task.value = "";
  showTasksList();
  showToastNotification("Task added successfully!", "success");
}

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const openModal = () => {
  modal.classList.add("active");
  overlay.classList.add("overlayActive");
};

const closeModal = () => {
  modal.classList.remove("active");
  overlay.classList.remove("overlayActive");
};

addTaskForm.addEventListener("submit", addTask);
