import { createRoute } from "./route";

const route = createRoute(document.getElementById("mount"));
window.addEventListener("hashchange", route, false);
route();
