import { LitElement, html } from "../lit.js";
import { globalStyles } from "../style.js";

export class Footer extends LitElement {
  globalStyles = globalStyles();

  template = html`
    ${this.globalStyles}
    <footer>
      <div class="container">
        <a href="#/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  `;

  render() {
    return this.template;
  }
}

window.customElements.define("c-footer", Footer);
