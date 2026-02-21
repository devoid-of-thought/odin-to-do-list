// Add your JavaScript code here
import "./styles.css";

import { newProjectButtonClickHandler,fromProjectJsonToDom, newTaskGroupButtonClickHandler} from "./dom-manipulation.js";
import { readLastUpdatedProjectJsonDataFromStorage,saveProjectJsonDataToStorage,readProjectsJsonDataFromStorage} from "./dom-helper-functions.js";
import { populateSidebar,initializeSidebar } from "./sidebar.js";

import template1 from "./templates/todolist-template.json" assert { type: "json" };

initializeSidebar();
populateSidebar();
const projects = readProjectsJsonDataFromStorage();
if (!projects || projects.length === 0) {
    saveProjectJsonDataToStorage(template1);
    fromProjectJsonToDom(template1);
    populateSidebar();
}   else {

    fromProjectJsonToDom(readLastUpdatedProjectJsonDataFromStorage());
}
newProjectButtonClickHandler();
newTaskGroupButtonClickHandler();
