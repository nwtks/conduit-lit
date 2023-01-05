import {
  LitElement,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import { importStyles } from "../style.js";
import { fetchGet, fetchPut } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { setAuth, clearAuth } from "../auth.js";

export class SettingsPage extends LitElement {
  static properties = {
    auth: { type: Object },
    image: { type: String },
    username: { type: String },
    bio: { type: String },
    email: { type: String },
    password: { type: String },
    errorMessages: { type: Array },
  };

  connectedCallback() {
    super.connectedCallback();
    this.fetchSettings();
  }

  async fetchSettings() {
    this.errorMessages = [];
    const res = await fetchGet("user", true);
    if (res.user) {
      this.image = res.user.image || "";
      this.username = res.user.username || "";
      this.bio = res.user.bio || "";
      this.email = res.user.email || "";
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  logout() {
    clearAuth();
    location.hash = "#/";
  }

  async submit() {
    const data = {
      user: {
        image: this.image,
        username: this.username,
        bio: this.bio,
        email: this.email,
      },
    };
    if (this.password) {
      data.user.password = this.password;
    }

    this.errorMessages = [];
    const res = await fetchPut("user", data, true);
    if (res.user) {
      setAuth(res.user);
      location.hash = "#/";
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  render() {
    return html`
      ${importStyles()}
      <c-navbar .auth=${this.auth} path="settings"></c-navbar>
      <div class="settings-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Your settings</h1>
              ${renderErrorMessages(this.errorMessages)}
              <form>
                <fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                      .value=${this.image || ""}
                      @change=${(e) => (this.image = e.target.value)}
                    />
                  </fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      .value=${this.username || ""}
                      @change=${(e) => (this.username = e.target.value)}
                    />
                  </fieldset>
                  <fieldset class="form-group">
                    <textarea
                      class="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                      .value=${this.bio || ""}
                      @change=${(e) => (this.bio = e.target.value)}
                    ></textarea>
                  </fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      .value=${this.email || ""}
                      @change=${(e) => (this.email = e.target.value)}
                    />
                  </fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      .value=${this.password || ""}
                      @change=${(e) => (this.password = e.target.value)}
                    />
                  </fieldset>
                  <button
                    class="btn btn-lg btn-primary pull-xs-right"
                    @click=${(e) => {
                      e.preventDefault();
                      this.submit();
                    }}
                  >
                    Update settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button
                class="btn btn-outline-danger"
                @click=${(e) => {
                  e.preventDefault();
                  this.logout();
                }}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-settings-page", SettingsPage);
