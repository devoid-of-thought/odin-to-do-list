// Add your JavaScript code here
import "./styles.css";
import "./todo.js";
import projectData from "./todolist-template.json" assert { type: "json" };

import { format } from "date-fns";
import { fromProjectJsonToDom } from "./todo.js";

const content = document.getElementById("content");

fromProjectJsonToDom(projectData);