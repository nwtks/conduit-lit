import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import "../component/navbar";
import "../component/footer";
import { authenticate } from "../auth";

export class LoginPage extends LitElement {
  static properties = {
    errorMessages: { type: Array },
    email: { type: String },
    password: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  submit(e) {
    e.preventDefault();
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
                  @click=${this.submit}
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
