import { LitElement, html, when } from "../lit.js";
import { importStyles } from "../style.js";
import { no_image } from "../config.js";

export class Navbar extends LitElement {
  static properties = {
    auth: { type: Object },
    path: { type: String },
  };

  renderActive(path) {
    return this.path === path ? "active" : "";
  }

  render() {
    return html`
      ${importStyles()}
      <nav class="navbar navbar-light">
        <div class="container">
          <a class="navbar-brand" href="#/">conduit</a>
          <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
              <a class="nav-link ${this.renderActive("home")}" href="#/">
                Home
              </a>
            </li>
            ${when(
              this.auth,
              () => html`
                <li class="nav-item">
                  <a
                    class="nav-link ${this.renderActive("editor")}"
                    href="#/editor"
                  >
                    <i class="ion-compose"></i>&#160;New article
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.renderActive("settings")}"
                    href="#/settings"
                  >
                    <i class="ion-gear-a"></i>&#160;Settings
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.renderActive("profile")}"
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
                    class="nav-link ${this.renderActive("login")}"
                    href="#/login"
                  >
                    Sign in
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link ${this.renderActive("register")}"
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
