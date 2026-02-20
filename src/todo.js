import { format } from "date-fns";
import { de } from "date-fns/locale";

function readProjectJsonDataFromStorage(jsonData) {}

function saveProjectJsonDataToStorage(jsonData) {}

function createProjectHeaderElement(
  projectTitle,
  projectDescription,
  projectDueDate,
) {
  const projectTitleElement = document.createElement("h2");
  projectTitleElement.textContent = projectTitle;
  projectTitleElement.id = "project-title";

  const projectDescriptionElement = document.createElement("p");
  projectDescriptionElement.textContent = projectDescription;
  projectDescriptionElement.id = "project-description";

  const projectDueDateElement = document.createElement("p");
  projectDueDateElement.textContent = `Due Date: ${format(new Date(projectDueDate), "d MMMM, yyyy")}`;
  projectDueDateElement.id = "project-due-date";

  const projectHeader = document.createElement("div");
  projectHeader.id = "project-header";


  projectHeader.appendChild(projectTitleElement);
  projectHeader.appendChild(projectDescriptionElement);
  projectHeader.appendChild(projectDueDateElement);

  return {
    projectHeader
  };
}

function extractProjectFromJson(jsonData) {
  const projectTitle = jsonData.meta.title;
  const projectDescription = jsonData.meta.description;
  const projectDueDate = jsonData.meta.due_date;
  const projectPriority = jsonData.meta.priority;

  return {
    projectTitle,
    projectDescription,
    projectDueDate,
    projectPriority,
  };
}
function extractTaskGroupsFromJson(jsonData) {
  const taskGroups = jsonData.task_groups;
  return taskGroups;
}
function sortTaskGroupsByPriority(taskGroup) {
  const priorityMap = {
    "High": 1,
    "Medium": 2,
    "Low": 3,
  };
  return taskGroup.sort((a, b) => priorityMap[a.priority] - (priorityMap[b.priority]));
}
function createTaskGroupElement(group) {
  const groupContainer = document.createElement("div");
  groupContainer.classList.add("task-group");
  groupContainer.id = `task-group-${group.id}`;
  
  const groupTaskHeader = document.createElement("div");
  groupTaskHeader.classList.add("task-group-header");
  const groupTitle = document.createElement("h3");
  groupTitle.textContent = group.name;

  const detailsButton = document.createElement("button");
  detailsButton.textContent = "Details";
  detailsButton.classList.add("edit-group-btn"); 
detailsButton.addEventListener("click", () => {
  const modal = document.createElement("dialog");
  
  modal.innerHTML = `
    <h2>${group.name}</h2>
    <p>Group ID: ${group.id}</p>
    <button id="close-modal">Close</button>
  `;
  
  document.body.appendChild(modal);
  modal.showModal();

  const closeButton = modal.querySelector("#close-modal");
  closeButton.addEventListener("click", () => {
    modal.close();
    modal.remove();
  });
});


  groupTaskHeader.appendChild(groupTitle);
  groupTaskHeader.appendChild(detailsButton);
  groupContainer.appendChild(groupTaskHeader);

  const taksList = document.createElement("ul");
  group.tasks = group.tasks || [];
  for (const task of group.tasks) {
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
    taskDueDate.textContent = `Due: ${format(new Date(task.due_date), "d MMMM, yyyy")}`;
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


  const { projectTitle, projectDescription, projectDueDate, projectPriority } = extractProjectFromJson(jsonData);

  const { projectHeader  } = createProjectHeaderElement(projectTitle, projectDescription, projectDueDate);

  projectContainer.appendChild(projectHeader);

  const taskGroups = extractTaskGroupsFromJson(jsonData);

  taskGroups.forEach((group) => {
    const groupContainer = createTaskGroupElement(group);
    projectContainer.appendChild(groupContainer);
    
  });
  content.appendChild(projectContainer);
}

export {
  readProjectJsonDataFromStorage,
  saveProjectJsonDataToStorage,
  fromProjectJsonToDom,
};
