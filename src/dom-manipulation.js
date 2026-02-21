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
import { populateSidebar } from "./sidebar.js";

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

      populateSidebar();

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

function newTaskButtonClickHandler(group) {
  const addTaskButton = document.createElement("button");
  addTaskButton.textContent = "Add Task";
  addTaskButton.classList.add("edit-group-btn");

  addTaskButton.addEventListener("click", () => {
    createModal("New Task", "Create a new task.", "new-task");
    
    const form = document.querySelector(".modal-body form");
        const addNotesButton = document.getElementById("add-notes-btn");
        addNotesButton.addEventListener("click", () => {
        const notesContainer = document.getElementById("task-notes-container");
        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.placeholder = "Enter a note";
        noteInput.id = `task-note-${Date.now()}`;
        notesContainer.appendChild(noteInput);
      });
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const taskTitle = document.getElementById("task-title").value.trim();
      const taskDescription = document.getElementById("task-description").value.trim();
      const taskDueDate = document.getElementById("task-due-date").value;
      const taskDueTime = document.getElementById("task-due-time").value;
      const taskPriority = document.getElementById("task-priority").value;



      if (!taskTitle || !taskDueDate || !taskDueTime) {
        alert("Task title, due date, and due time are required.");
        return; 
      }

      const projectTitleElement = document.getElementById("project-title");
      const projectJson = readProjectJsonDataFromStorage(projectTitleElement.textContent);
      
      const taskGroup = projectJson.task_groups.find((g) => g.id === group.id);
      const taskNotes = Array.from(document.querySelectorAll("#task-notes-container input")).map(input => input.value.trim()).filter(note => note !== "");
      if (taskGroup) {
        const newTask = {
          id: Date.now(),
          name: taskTitle,
          description: taskDescription,
          due_date: taskDueDate,
          due_time: taskDueTime,
          notes: taskNotes,
          priority: taskPriority,
          completed: false,
        };
        
        taskGroup.tasks.push(newTask);
        saveProjectJsonDataToStorage(projectJson);

        const modal = document.querySelector("dialog");
        modal.close();
        modal.remove();

        const content = document.getElementById("content");
        content.innerHTML = "";
        fromProjectJsonToDom(projectJson);
      } else {
        alert("Task group not found.");
      }
    });
  });
  
  return addTaskButton;
}

function createTaskDetailsElement(group,task) {const taskElement = document.createElement("div");
      taskElement.classList.add("task-details-container");

      const taskElementHeader = document.createElement("h3");
      taskElementHeader.textContent = task.name;
      taskElement.appendChild(taskElementHeader);

      const taskMetaContainer = document.createElement("div");
      taskMetaContainer.classList.add("task-meta-container");

      const taskDescriptionContainer = document.createElement("div");
      taskDescriptionContainer.classList.add("task-description-container");
      const taskDescriptionHeader = document.createElement("h4");
      taskDescriptionHeader.textContent = "Description:";
      taskDescriptionContainer.appendChild(taskDescriptionHeader);

      const taskDescriptionContent = document.createElement("p");
      taskDescriptionContent.textContent = task.description || "No description provided.";
      taskDescriptionContainer.appendChild(taskDescriptionContent);
      taskMetaContainer.appendChild(taskDescriptionContainer);

      const taskDueDateContainer = document.createElement("div");
      taskDueDateContainer.classList.add("task-due-date-container");
      const taskDueDateHeader = document.createElement("h4");
      taskDueDateHeader.textContent = "Due Date:";
      taskDueDateContainer.appendChild(taskDueDateHeader);

      const taskDueDateContent = document.createElement("p");
      taskDueDateContent.textContent = `${format(new Date(task.due_date), "d MMMM, yyyy")} at ${task.due_time}`;
      taskDueDateContainer.appendChild(taskDueDateContent);
      taskMetaContainer.appendChild(taskDueDateContainer);


      const taskPriorityContainer = document.createElement("div");
      taskPriorityContainer.classList.add("task-priority-container");
      const taskPriorityHeader = document.createElement("h4");
      taskPriorityHeader.textContent = "Priority:";
      taskPriorityContainer.appendChild(taskPriorityHeader);

      const taskPriorityContent = document.createElement("p");
      taskPriorityContent.textContent = task.priority;
      taskPriorityContainer.appendChild(taskPriorityContent);
      taskMetaContainer.appendChild(taskPriorityContainer);

      taskElement.appendChild(taskMetaContainer);

      const taskNotesAndEditContainer = document.createElement("div");
      taskNotesAndEditContainer.classList.add("task-notes-and-edit-container");

      const taskNotesContainer = document.createElement("div");
      taskNotesContainer.classList.add("task-notes-container");

      if (task.notes && task.notes.length > 0) {
        
        const notesHeader = document.createElement("h4");
        notesHeader.textContent = "Notes:";
        taskNotesContainer.appendChild(notesHeader);

        const notesList = document.createElement("ul");
        for (const note of task.notes) {
          const noteItem = document.createElement("li");
          noteItem.textContent = note;
          notesList.appendChild(noteItem);
        }
        taskNotesContainer.appendChild(notesList);
      }
      const editTaskButton = document.createElement("button");
      editTaskButton.textContent = "Edit Task";
      editTaskButton.classList.add("edit-task-btn");

      addEditTaskButtonListener(group,editTaskButton, task);


      taskNotesAndEditContainer.appendChild(taskNotesContainer);
      taskNotesAndEditContainer.appendChild(editTaskButton);
      taskElement.appendChild(taskNotesAndEditContainer);
      return taskElement;
    }


function addEditTaskButtonListener(group,editTaskButton, task) {

        editTaskButton.addEventListener("click", () => {
        createModal("Edit Task", "Edit the task details.", "edit-task");
        const form = document.querySelector(".modal-body form");
        const taskTitleInput = document.getElementById("edit-task-title");
        const taskDescriptionInput = document.getElementById("edit-task-description");
        const taskDueDateInput = document.getElementById("edit-task-due-date");
        const taskDueTimeInput = document.getElementById("edit-task-due-time");
        const taskPriorityInput = document.getElementById("edit-task-priority");
        const addNotesButton = document.getElementById("edit-add-notes-btn");
        const taskNotesContainer = document.getElementById("edit-task-notes-container");
        
        taskTitleInput.value = task.name;
        taskDescriptionInput.value = task.description;
        taskDueDateInput.value = task.due_date;
        taskDueTimeInput.value = task.due_time;
        taskPriorityInput.value = task.priority;
        if (task.notes && task.notes.length > 0) {
          for (const note of task.notes) {
            const noteInput = document.createElement("input");
            noteInput.type = "text";
            noteInput.value = note;
            taskNotesContainer.appendChild(noteInput);
          }
        }

        addNotesButton.addEventListener("click", () => {
          const noteInput = document.createElement("input");
          noteInput.type = "text";
          noteInput.placeholder = "Enter a note";
          noteInput.id = `task-note-${Date.now()}`;
          taskNotesContainer.appendChild(noteInput);
      });
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          const updatedTaskTitle = taskTitleInput.value.trim();
          const updatedTaskDescription = taskDescriptionInput.value.trim();
          const updatedTaskDueDate = taskDueDateInput.value;
          const updatedTaskDueTime = taskDueTimeInput.value;
          const updatedTaskPriority = taskPriorityInput.value;
          const updatedTaskNotes = Array.from(taskNotesContainer.querySelectorAll("input")).map(input => input.value.trim()).filter(note => note !== "");

          if (!updatedTaskTitle || !updatedTaskDueDate || !updatedTaskDueTime) {
            alert("Task title, due date, and due time are required.");
            return; 
          }

          task.name = updatedTaskTitle;
          task.description = updatedTaskDescription;
          task.due_date = updatedTaskDueDate;
          task.due_time = updatedTaskDueTime;
          task.priority = updatedTaskPriority;
          task.notes = updatedTaskNotes;

          const projectTitleElement = document.getElementById("project-title");
          const projectJson = readProjectJsonDataFromStorage(projectTitleElement.textContent);
          const taskGroup = projectJson.task_groups.find((g) => g.id === group.id);
          if (taskGroup) {
            const taskIndex = taskGroup.tasks.findIndex((t) => t.id === task.id);
            if (taskIndex !== -1) {
              taskGroup.tasks[taskIndex] = task;
              saveProjectJsonDataToStorage(projectJson);

              const content = document.getElementById("content");
              content.innerHTML = "";
              fromProjectJsonToDom(projectJson);
            } else {
              alert("Task not found in the group.");
            }
          } else {
            alert("Task group not found.");
          }

          const modal = form.closest("dialog");
          modal.close();
          modal.remove();
        });
    });
}
function detailsButtonClickHandler(group) {
  const detailsButton = document.createElement("button");
  detailsButton.textContent = "Details";
  detailsButton.classList.add("edit-group-btn");

  
  detailsButton.addEventListener("click", () => {
    createModal("Edit Task Group", "Edit the task group.", "edit-task-group");
    const modal = document.querySelector("dialog");
    const modalBody = modal.querySelector(".modal-body");
    for (const task of group.tasks) {
      const taskElement = createTaskDetailsElement(group, task);
      modalBody.appendChild(taskElement);
    }
  });
  return detailsButton;
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

  const addTaskButton = newTaskButtonClickHandler(group);
  const detailsButton = detailsButtonClickHandler(group);
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
