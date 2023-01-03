import {
  LitElement,
  html,
  map,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import { fetchGet, fetchPut } from "../fetch.js";
import { setAuth, clearAuth } from "../auth.js";

export class SettingsPage extends LitElement {
  static properties = {
    auth: { type: Object },
    errorMessages: { type: Array },
    image: { type: String },
    username: { type: String },
    bio: { type: String },
    email: { type: String },
    password: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchSettings();
  }

  fetchSettings() {
    fetchGet("user", true).then((r) => {
      this.image = r.user.image || "";
      this.username = r.user.username || "";
      this.bio = r.user.bio || "";
      this.email = r.user.email || "";
    });
  }

  logout(e) {
    e.preventDefault();
    clearAuth();
    location.hash = "#/";
  }

  submit(e) {
    e.preventDefault();
    this.errorMessages = [];

    const data = {
      user: {
        image: this.image,
        username: this.username,
        bio: this.bio,
        email: this.email,
      },
    };
    if (this.password && this.password.length) {
      data.user.password = this.password;
    }

    fetchPut("user", JSON.stringify(data), true).then((r) => {
      if (r.errors) {
        this.errorMessages = Object.keys(r.errors).flatMap((k) =>
          r.errors[k].map((m) => k + " " + m)
        );
      } else {
        setAuth(r.user);
        location.hash = "#/";
      }
    });
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth} path="settings"></c-navbar>
      <div class="settings-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Your settings</h1>
              <ul class="error-messages">
                ${map(this.errorMessages, (item) => html`<li>${item}</li>`)}
              </ul>
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
                    @click=${this.submit}
                  >
                    Update settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button class="btn btn-outline-danger" @click=${this.logout}>
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
