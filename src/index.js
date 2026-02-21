// Add your JavaScript code here
import "./styles.css";

import { newProjectButtonClickHandler,fromProjectJsonToDom, newTaskGroupButtonClickHandler} from "./dom-manipulation.js";
import { readLastUpdatedProjectJsonDataFromStorage,saveProjectJsonDataToStorage} from "./dom-helper-functions.js";
import { populateSidebar,initializeSidebar } from "./sidebar.js";
import template1 from "./templates/another-template.json";
import template2 from "./templates/todolist-template.json";



initializeSidebar();
populateSidebar();
fromProjectJsonToDom(readLastUpdatedProjectJsonDataFromStorage());

newProjectButtonClickHandler();
newTaskGroupButtonClickHandler();