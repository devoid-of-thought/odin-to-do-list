import { add, format } from "date-fns";


export
    {
        readProjectsJsonDataFromStorage,
        saveProjectJsonDataToStorage,
        cleanStorage,
        extractProjectFromJson,
        extractTaskGroupsFromJson,
        sortTaskGroupByPriority,
        createModal,
        createProjectJsonFromForm,
        validateprojectForm,
    };
function readProjectsJsonDataFromStorage() {
  const projectKeys = Object.keys(localStorage);
  if (projectKeys.length === 0) {
    return null;
  }
  const localStorageData = projectKeys.map((key) => {
    const jsonData = localStorage.getItem(key);
    return JSON.parse(jsonData);
  });
  return localStorageData;
}

function saveProjectJsonDataToStorage(jsonData) {
  localStorage.setItem(jsonData.meta.title, JSON.stringify(jsonData));
}
function cleanStorage() {
  localStorage.clear();
}
function extractProjectFromJson(jsonData) {
  const projectTitle = jsonData.meta.title;
  const projectDescription = jsonData.meta.description;
  const projectDueDate = jsonData.meta.due_date;
  const projectDueTime = jsonData.meta.due_time;
  const projectPriority = jsonData.meta.priority;

  return {
    projectTitle,
    projectDescription,
    projectDueDate,
    projectDueTime,
    projectPriority,
  };
}
function extractTaskGroupsFromJson(jsonData) {
  const taskGroups = jsonData.task_groups;
  return taskGroups;
}
function sortTaskGroupByPriority(taskGroup) {
  const priorityMap = {
    High: 1,
    Medium: 2,
    Low: 3,
  };
  return taskGroup.sort(
    (a, b) => (priorityMap[a.priority] || 4) - (priorityMap[b.priority] || 4),
  );
}

function addTimePickerToModal() {
  const timeInput = document.getElementById("project-form-due-time");

  timeInput.addEventListener("click", () => {
    if (document.getElementById("time-picker-modal")) {
      return;
    }
    const modal = document.createElement("dialog");
    modal.id = "time-picker-modal";
    modal.innerHTML = `
      <div class="modal-header">
        <h2>Select Due Time</h2>
        <button id="close-time-modal">Close</button>
      </div>
      <div class="time-picker-container">
       <div class="time-picker-inputs">
        <label for="time-picker">Hours:</label>
        <input type="number" id="Hours" min="0" max="23" value="00" name="time-picker" required>
        <label for="time-picker">Minutes:</label>
        <input type="number" id="Minutes" min="0" max="59" value="00" name="time-picker" required>
        </div>
        <button id="save-time-btn">Save Time</button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.showModal();
    const dateInput = modal.querySelector("#project-form-due-date");
    const saveButton = modal.querySelector("#save-time-btn");
    const closeButton = modal.querySelector("#close-time-modal");

    saveButton.addEventListener("click", () => {
      const hours = document.getElementById("Hours").value;
      const minutes = document.getElementById("Minutes").value;
      if (isNaN(hours) || hours < 0 || hours > 23) {
        alert("Please enter a valid hour (0-23).");
        return;
      }
      if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        alert("Please enter valid minutes (0-59).");
        return;
      }
      timeInput.value = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      modal.close();
      modal.remove();
    });

    closeButton.addEventListener("click", () => {
      modal.close();
      modal.remove();
    });
  });
}

function createModal(headerText, headerContent, type) {
  const modal = document.createElement("dialog");
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalHeader.innerHTML = `
        <h2>${headerText}</h2>
        <p>${headerContent}</p>
        <button id="close-modal">Close</button>
      `;
  modal.appendChild(modalHeader);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  switch (type) {
    case "new-project":
      const form = document.createElement("form");
      form.innerHTML = `
            <label for="project-title">Project Title:</label>
            <input type="text" id="project-form-title" name="project-title" required>
            
            <label for="project-description">Project Description:</label>
            <textarea id="project-form-description" name="project-description" required></textarea>
            
            <label for="project-due-date">Due Date:</label>
            <input type="date" id="project-form-due-date" name="project-due-date" value=${new Date().toISOString().split("T")[0]} required>
            <label for="project-due-time">Due Time:</label>
            <input type="text" id="project-form-due-time" name="project-due-time" required>

            <label for="project-priority">Priority:</label>
            <select id="project-form-priority" name="project-priority">
              <option value="High">High</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low</option>
            </select>

            <button type="submit">Create Project</button>
          `;
      modalBody.appendChild(form);
      break;
    case "edit-project":
      // Create form elements for editing project
      break;
    case "new-task-group":
      // Create form elements for new task group
      break;
    case "edit-task-group":
      // Create form elements for editing task group
      break;
    default:
      modalBody.innerHTML = "<p>Form content goes here.</p>";
  }
  modal.appendChild(modalBody);
  document.body.appendChild(modal);
  modal.showModal();
  if (type === "new-project") {
    addTimePickerToModal();
  }
  const closeButton = modal.querySelector("#close-modal");
  closeButton.addEventListener("click", () => {
    modal.close();
    modal.remove();
  });
}

function createProjectJsonFromForm(
  title,
  description,
  dueDate,
  dueTime,
  priority,
) {
  const projectJson = {
    meta: {
      title: title,
      description: description,
      due_date: dueDate,
      due_time: dueTime,
      priority: priority,
    },
    task_groups: [],
  };
  return projectJson;
}

function validateprojectForm() {
  const titleInput = document.getElementById("project-form-title");
  const descriptionInput = document.getElementById("project-form-description");
  const dueDateInput = document.getElementById("project-form-due-date");
  const dueTimeInput = document.getElementById("project-form-due-time");

  if (!titleInput.value.trim()) {
    alert("Project title is required.");
    return false;
  }

  if (!descriptionInput.value.trim()) {
    alert("Project description is required.");
    return false;
  }

  if (!dueDateInput.value) {
    alert("Project due date is required.");
    return false;
  }

  if (
    dueDateInput.value &&
    new Date(dueDateInput.value + "T" + dueTimeInput.value) < new Date()
  ) {
    alert("Project due date and time cannot be in the past.");
    return false;
  }

  if (titleInput.value.length > 50) {
    alert("Project title must be 50 characters or less.");
    return false;
  }
  if (descriptionInput.value.length > 200) {
    alert("Project description must be 200 characters or less.");
    return false;
  }
  return true;
}
