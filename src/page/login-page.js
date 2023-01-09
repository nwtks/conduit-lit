import { LitElement, html } from "../lit.js";
import "../component/navbar.js";
import "../component/footer.js";
import { globalStyles } from "../style.js";
import { fetchPost } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { setAuth } from "../auth.js";

export class LoginPage extends LitElement {
  static properties = {
    email: { type: String },
    password: { type: String },
    errorMessages: { type: Array },
  };

  globalStyles = globalStyles();

  connectedCallback() {
    super.connectedCallback();
    this.email = "";
    this.password = "";
  }

  async submit() {
    this.errorMessages = [];
    const res = await fetchPost("users/login", {
      user: {
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
      ${this.globalStyles}
      <c-navbar path="login"></c-navbar>
      <div class="auth-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Sign in</h1>
              <p class="text-xs-center">
                <a href="#/register">Need an account?</a>
              </p>
              ${renderErrorMessages(this.errorMessages)}
              <form>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    .value=${this.email}
                    @change=${(e) => (this.email = e.target.value)}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    .value=${this.password}
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
