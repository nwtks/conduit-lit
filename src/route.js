import { getAuth } from "./auth.js";

const mountPage = (mount, page) => {
  mount.innerHTML = "";
  mount.appendChild(page);
};

export const createRoute = (mount) => async () => {
  const hash = location.hash || "";
  if (hash === "#/") {
    const { HomePage } = await import("./page/home-page.js");
    const page = new HomePage();
    page.auth = getAuth();
    mountPage(mount, page);
  } else if (hash.startsWith("#/article/")) {
    const { ArticlePage } = await import("./page/article-page.js");
    const page = new ArticlePage();
    page.auth = getAuth();
    page.slug = decodeURIComponent(hash.substring(10));
    mountPage(mount, page);
  } else if (hash === "#/editor") {
    const { EditorPage } = await import("./page/editor-page.js");
    const page = new EditorPage();
    page.auth = getAuth();
    mountPage(mount, page);
  } else if (hash.startsWith("#/editor/")) {
    const { EditorPage } = await import("./page/editor-page.js");
    const page = new EditorPage();
    page.auth = getAuth();
    page.slug = decodeURIComponent(hash.substring(9));
    mountPage(mount, page);
  } else if (hash === "#/settings") {
    const { SettingsPage } = await import("./page/settings-page.js");
    const page = new SettingsPage();
    page.auth = getAuth();
    mountPage(mount, page);
  } else if (hash.startsWith("#/profile/")) {
    const { ProfilePage } = await import("./page/profile-page.js");
    const page = new ProfilePage();
    page.auth = getAuth();
    page.username = decodeURIComponent(hash.substring(10));
    mountPage(mount, page);
  } else if (hash === "#/login") {
    const { LoginPage } = await import("./page/login-page.js");
    const page = new LoginPage();
    mountPage(mount, page);
  } else if (hash === "#/register") {
    const { RegisterPage } = await import("./page/register-page.js");
    const page = new RegisterPage();
    mountPage(mount, page);
  } else {
    location.hash = "#/";
  }
};
