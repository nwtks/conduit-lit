import { LitElement, html } from "../lit.js";
import { globalStyles } from "../style.js";

export class Footer extends LitElement {
  static properties = {
    globalStyles: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.globalStyles = globalStyles();
  }

  render() {
    return html`
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
  }
}

window.customElements.define("c-footer", Footer);
