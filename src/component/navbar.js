import {
  LitElement,
  html,
  when,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import { no_image } from "../config.js";

export class Navbar extends LitElement {
  static properties = {
    auth: { type: Object },
    path: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nav class="navbar navbar-light">
        <div class="container">
          <a class="navbar-brand" href="#/">conduit</a>
          <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
              <a
                class="nav-link ${this.path === "home" ? "active" : ""}"
                href="#/"
              >
                Home
              </a>
            </li>
            ${when(
              this.auth,
              () => html`
                <li class="nav-item">
                  <a
                    class="nav-link ${this.path === "editor" ? "active" : ""}"
                    href="#/editor"
                  >
                    <i class="ion-compose"></i>&#160;New article
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.path === "settings" ? "active" : ""}"
                    href="#/settings"
                  >
                    <i class="ion-gear-a"></i>&#160;Settings
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.path === "profile" ? "active" : ""}"
                    href="#/profile/${this.auth.username}"
                  >
                    <img class="user-pic" src=${this.auth.image || no_image} />
                    ${this.auth.username}
                  </a>
                </li>
              `,
              () => html`
                <li class="nav-item">
                  <a
                    class="nav-link ${this.path === "login" ? "active" : ""}"
                    href="#/login"
                  >
                    Sign in
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.path === "register" ? "active" : ""}"
                    href="#/register"
                  >
                    Sign up
                  </a>
                </li>
              `
            )}
          </ul>
        </div>
      </nav>
    `;
  }
}

window.customElements.define("c-navbar", Navbar);
