import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import "../component/navbar";
import "../component/footer";
import { fetchPost } from "../fetch";
import { setAuth } from "../auth";

export class RegisterPage extends LitElement {
  static properties = {
    errorMessages: { type: Array },
    username: { type: String },
    email: { type: String },
    password: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  submit(e) {
    e.preventDefault();
    this.errorMessages = [];
    fetchPost(
      "users",
      JSON.stringify({
        user: {
          username: this.username,
          email: this.email,
          password: this.password,
        },
      })
    ).then((r) => {
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
      <c-navbar path="register"></c-navbar>
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign up</h1>
              <p class="text-xs-center">
                <a href="#/login">Have an account?</a>
              </p>
              <ul class="error-messages">
                ${map(this.errorMessages, (item) => html`<li>${item}</li>`)}
              </ul>
              <form>
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
                  Sign up
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

window.customElements.define("c-register-page", RegisterPage);
