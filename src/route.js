import { getAuth } from "./auth";

const mountPage = (mount, page) => {
  mount.innerHTML = "";
  mount.appendChild(page);
};

export const createRoute = (mount) => () => {
  const hash = location.hash || "";
  if (hash === "#/") {
    import("./page/home-page").then((mod) => {
      const page = new mod.HomePage();
      page.auth = getAuth();
      mountPage(mount, page);
    });
  } else if (hash.startsWith("#/article/")) {
    import("./page/article-page").then((mod) => {
      const page = new mod.ArticlePage();
      page.auth = getAuth();
      page.slug = decodeURIComponent(hash.substring(10));
      mountPage(mount, page);
    });
  } else if (hash === "#/editor") {
    import("./page/editor-page").then((mod) => {
      const page = new mod.EditorPage();
      page.auth = getAuth();
      mountPage(mount, page);
    });
  } else if (hash.startsWith("#/editor/")) {
    import("./page/editor-page").then((mod) => {
      const page = new mod.EditorPage();
      page.auth = getAuth();
      page.slug = decodeURIComponent(hash.substring(9));
      mountPage(mount, page);
    });
  } else if (hash === "#/settings") {
    import("./page/settings-page").then((mod) => {
      const page = new mod.SettingsPage();
      page.auth = getAuth();
      mountPage(mount, page);
    });
  } else if (hash.startsWith("#/profile/")) {
    import("./page/profile-page").then((mod) => {
      const page = new mod.ProfilePage();
      page.auth = getAuth();
      page.username = decodeURIComponent(hash.substring(10));
      mountPage(mount, page);
    });
  } else if (hash === "#/login") {
    import("./page/login-page").then((mod) => {
      const page = new mod.LoginPage();
      mountPage(mount, page);
    });
  } else if (hash === "#/register") {
    import("./page/register-page").then((mod) => {
      const page = new mod.RegisterPage();
      mountPage(mount, page);
    });
  } else {
    location.hash = "#/";
  }
};
