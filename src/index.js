import { createRoute } from "./route.js";

const route = createRoute(document.getElementById("mount"));
window.addEventListener("hashchange", route, false);
route();
