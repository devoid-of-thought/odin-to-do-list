// Add your JavaScript code here
import "./styles.css";
import projectData from "./todolist-template.json" assert { type: "json" };

import { format } from "date-fns";
import { newProjectButtonClickHandler,fromProjectJsonToDom } from "./dom-manipulation.js";
import { saveProjectJsonDataToStorage } from "./dom-helper-functions.js";
import { populateSidebar } from "./sidebar.js";

const content = document.getElementById("content");

fromProjectJsonToDom(projectData);
saveProjectJsonDataToStorage(projectData);
populateSidebar();
newProjectButtonClickHandler();