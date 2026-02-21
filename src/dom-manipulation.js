import { add, format } from "date-fns";
import {
  readProjectsJsonDataFromStorage,
  readProjectJsonDataFromStorage,
  saveProjectJsonDataToStorage,
  extractProjectFromJson,
  extractTaskGroupsFromJson,
  sortTaskGroupByPriority,
  createModal,
  createProjectJsonFromForm,
  validateprojectForm,
} from "./dom-helper-functions.js";
import { id } from "date-fns/locale";

export {
  newProjectButtonClickHandler,
  fromProjectJsonToDom,
  newTaskGroupButtonClickHandler,
};

function newProjectButtonClickHandler() {
  const newProjectButton = document.getElementById("new-project-btn");

  newProjectButton.addEventListener("click", () => {
    createModal("New Project", "Create a new project.", "new-project");
    const form = document.querySelector(".modal-body form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateprojectForm()) {
        return false;
      }
      const json = createProjectJsonFromForm(
        document.getElementById("project-form-title").value.trim(),
        document.getElementById("project-form-description").value.trim(),
        document.getElementById("project-form-due-date").value,
        document.getElementById("project-form-due-time").value,
        document.getElementById("project-form-priority").value,
      );
      saveProjectJsonDataToStorage(json);
      const modal = document.querySelector("dialog");
      modal.close();
      modal.remove();
    });
  });
}
function newTaskGroupButtonClickHandler() {
  const newTaskGroupButton = document.getElementById("new-task-group-btn");

  newTaskGroupButton.addEventListener("click", () => {
    createModal("New Task Group", "Create a new task group.", "new-task-group");
    const form = document.querySelector(".modal-body form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const taskGroupName = document
        .getElementById("task-group-name")
        .value.trim();
      if (taskGroupName) {
        console.log(`Creating task group: ${taskGroupName}`);
        const projectTitleElement = document.getElementById("project-title");
        const projectJson = readProjectJsonDataFromStorage(
          projectTitleElement.textContent,
        );
        const newTaskGroup = {
          id: Date.now(),
          name: taskGroupName,
          tasks: [],
        };
        projectJson.task_groups.push(newTaskGroup);
        saveProjectJsonDataToStorage(projectJson);

        const modal = document.querySelector("dialog");
        modal.close();
        modal.remove();

        const content = document.getElementById("content");
        content.innerHTML = "";
        fromProjectJsonToDom(projectJson);
      } else {
        alert("Task group name is required.");
      }
    });
  });
}

function createProjectHeaderElement(
  projectTitle,
  projectDescription,
  projectDueDate,
  projectDueTime,
) {
  const projectTitleElement = document.createElement("h2");
  projectTitleElement.textContent = projectTitle;
  projectTitleElement.id = "project-title";

  const projectDescriptionElement = document.createElement("p");
  projectDescriptionElement.textContent = projectDescription;
  projectDescriptionElement.id = "project-description";

  const projectDueDateElement = document.createElement("p");
  projectDueDateElement.textContent = `Due Date: ${format(new Date(projectDueDate), "d MMMM, yyyy")} at ${projectDueTime}`;
  projectDueDateElement.id = "project-due-date";

  const projectHeader = document.createElement("div");
  projectHeader.id = "project-header";

  projectHeader.appendChild(projectTitleElement);
  projectHeader.appendChild(projectDescriptionElement);
  projectHeader.appendChild(projectDueDateElement);

  return projectHeader;
}

function createTaskGroupElement(group) {
  const groupContainer = document.createElement("div");
  groupContainer.classList.add("task-group");
  groupContainer.id = `task-group-${group.id}`;

  const groupTaskHeader = document.createElement("div");
  groupTaskHeader.classList.add("task-group-header");
  const groupTitle = document.createElement("h3");
  groupTitle.textContent = group.name;


const addTaskButton = document.createElement("button");
  addTaskButton.textContent = "Add Task";
  addTaskButton.classList.add("edit-group-btn");
  addTaskButton.addEventListener("click", () => {
    createModal(
      "New Task",
      "This is where the form to create a new task will go.",
    );
  });


  const detailsButton = document.createElement("button");
  detailsButton.textContent = "Details";
  detailsButton.classList.add("edit-group-btn");
  detailsButton.addEventListener("click", () => {
    createModal(
      "Edit Task Group",
      "This is where the form to edit the task group will go.",
    );
  });


  groupTaskHeader.appendChild(groupTitle);
    groupTaskHeader.appendChild(addTaskButton);
  groupTaskHeader.appendChild(detailsButton);
  groupContainer.appendChild(groupTaskHeader);
  const groupInfo = document.createElement("p");
  const taskname = document.createElement("p");
  taskname.textContent = `Name`;
  const duedate = document.createElement("p");
  duedate.textContent = `Due Date`;

  groupInfo.appendChild(taskname);
  groupInfo.appendChild(duedate);
  groupInfo.classList.add("group-info");
  groupContainer.appendChild(groupInfo);
  const taksList = document.createElement("ul");
  const sortedTasks = sortTaskGroupByPriority([...group.tasks]);
  for (const task of sortedTasks) {
    const taskElement = document.createElement("li");
    const label = document.createElement("label");
    label.classList.add("custom-checkbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.name = `task-${task.name}-${task.id}`;
    label.appendChild(checkbox);
    const span = document.createElement("span");
    span.classList.add("checkmark");

    label.appendChild(span);
    label.appendChild(document.createTextNode(task.name));

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = `${format(new Date(task.due_date), "d MMMM, yyyy")} at ${task.due_time}  `;
    taskDueDate.classList.add("task-due-date");

    taskElement.appendChild(label);
    taskElement.appendChild(taskDueDate);
    taksList.appendChild(taskElement);
  }


  
  groupContainer.appendChild(taksList);

  return groupContainer;
}

function fromProjectJsonToDom(jsonData) {
  const content = document.getElementById("content");

  const projectContainer = document.createElement("div");
  projectContainer.id = "project-container";

  const { projectTitle, projectDescription, projectDueDate, projectDueTime } =
    extractProjectFromJson(jsonData);

  const projectHeader = createProjectHeaderElement(
    projectTitle,
    projectDescription,
    projectDueDate,
    projectDueTime,
  );

  projectContainer.appendChild(projectHeader);

  const taskGroups = extractTaskGroupsFromJson(jsonData);

  taskGroups.forEach((group) => {
    const groupContainer = createTaskGroupElement(group);
    projectContainer.appendChild(groupContainer);
  });
  content.appendChild(projectContainer);
}
