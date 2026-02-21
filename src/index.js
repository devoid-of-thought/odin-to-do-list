// Add your JavaScript code here
import "./styles.css";
import projectData from "./templates/todolist-template.json" assert { type: "json" };
import anotherProjectData from "./templates/another-template.json" assert { type: "json" };

import { newProjectButtonClickHandler,fromProjectJsonToDom, newTaskGroupButtonClickHandler} from "./dom-manipulation.js";
import { saveProjectJsonDataToStorage,cleanStorage } from "./dom-helper-functions.js";
import { populateSidebar,initializeSidebar } from "./sidebar.js";


fromProjectJsonToDom(projectData);
saveProjectJsonDataToStorage(projectData);
saveProjectJsonDataToStorage(anotherProjectData);
initializeSidebar();
populateSidebar();

newProjectButtonClickHandler();
newTaskGroupButtonClickHandler();