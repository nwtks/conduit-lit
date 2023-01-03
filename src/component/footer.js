import {
  LitElement,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";

export class Footer extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
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
