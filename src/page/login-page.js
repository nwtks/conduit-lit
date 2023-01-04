import {
  LitElement,
  html,
  map,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import { authenticate } from "../auth.js";

export class LoginPage extends LitElement {
  static properties = {
    email: { type: String },
    password: { type: String },
    errorMessages: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  submit() {
    this.errorMessages = [];
    authenticate(this.email, this.password)
      .then((success) => {
        location.hash = "#/";
      })
      .catch((errors) => {
        this.errorMessages = Object.keys(errors).flatMap((k) =>
          errors[k].map((m) => k + " " + m)
        );
      });
  }

  render() {
    return html`
      <c-navbar path="login"></c-navbar>
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign in</h1>
              <p class="text-xs-center">
                <a href="#/register">Need an account?</a>
              </p>
              <ul class="error-messages">
                ${map(this.errorMessages, (item) => html`<li>${item}</li>`)}
              </ul>
              <form>
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
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-login-page", LoginPage);
