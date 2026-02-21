import {readProjectsJsonDataFromStorage} from "./dom-helper-functions.js";
import {fromProjectJsonToDom} from "./dom-manipulation.js";

export {
    populateSidebar
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
function populateSidebar() {
    const projectList = document.querySelector("#sidebar-project-list");

    const projects = readProjectsJsonDataFromStorage();

    sortSidebarProjectsByPriority(projects);
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

const menuButton = document.getElementById("menu-button");

menuButton.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-open");
});