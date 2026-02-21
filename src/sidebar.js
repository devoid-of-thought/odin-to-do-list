import {readProjectsJsonDataFromStorage} from "./dom-helper-functions.js";
import {fromProjectJsonToDom} from "./dom-manipulation.js";

export {
    populateSidebar,
    initializeSidebar
};

function sortSidebarProjectsByPriority(projects) {
    const priorityMap = {
        High: 1,
        Medium: 2,
        Low: 3,
    };
    return projects.sort(
        (a, b) => (priorityMap[a.meta.priority] || 4) - (priorityMap[b.meta.priority] || 4),
    );
}
function sortByDefault(projects) {
    return projects.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
}
function populateSidebar() {
    const sort  =  document.getElementById("sidebar-project-select").value;
    const projectList = document.querySelector("#sidebar-project-list");

    const projects = readProjectsJsonDataFromStorage();

    if (sort === "priority") {
        sortSidebarProjectsByPriority(projects);
    } else if (sort === "Due-date") {
        sortProjectsByDueDate(projects);
    } else if (sort === "default") {
        sortByDefault(projects);
    }
    projectList.innerHTML = "";
    projects.forEach(project => {
        const projectItem = document.createElement("li");
        projectItem.textContent = project.meta.title;

        projectItem.addEventListener("click", () => {
            loadProject(project);
        });

        projectList.appendChild(projectItem);
    });
}
function loadProject(project) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    fromProjectJsonToDom(project);
}

function initializeSidebar() {
    const menuButton = document.getElementById("menu-button");

    menuButton.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-open");
    });
        const sortSelect = document.getElementById("sidebar-project-select");
    sortSelect.addEventListener("change", () => {
        populateSidebar();
    });
}


function sortProjectsByDueDate(projects) {
    return projects.sort((a, b) => {
        const dateA = new Date(a.meta.due_date);
        const dateB = new Date(b.meta.due_date);
        return dateA - dateB;
    });
}

function sortProjectsByPriority(projects) {
    const priorityMap = {
        High: 1,
        Medium: 2,
        Low: 3,
    };
    return projects.sort(
        (a, b) => (priorityMap[a.meta.priority] || 4) - (priorityMap[b.meta.priority] || 4),
    );
}
