import { LitElement, html } from "../lit.js";
import "../component/navbar.js";
import "../component/footer.js";
import { importStyles } from "../style.js";
import { fetchPost } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { setAuth } from "../auth.js";

export class RegisterPage extends LitElement {
  static properties = {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    errorMessages: { type: Array },
  };

  async submit() {
    this.errorMessages = [];
    const res = await fetchPost("users", {
      user: {
        username: this.username,
        email: this.email,
        password: this.password,
      },
    });
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
      <c-navbar path="register"></c-navbar>
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign up</h1>
              <p class="text-xs-center">
                <a href="#/login">Have an account?</a>
              </p>
              ${renderErrorMessages(this.errorMessages)}
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
                  @click=${(e) => {
                    e.preventDefault();
                    this.submit();
                  }}
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
