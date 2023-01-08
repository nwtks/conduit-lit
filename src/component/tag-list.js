import { LitElement, html, map } from "../lit.js";
import { globalStyles } from "../style.js";

export class TagList extends LitElement {
  static properties = {
    tags: { type: Array },
    globalStyles: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.globalStyles = globalStyles();
  }

  render() {
    return html`
      ${this.globalStyles}
      <ul class="tag-list">
        ${map(
          this.tags,
          (item) =>
            html`<li class="tag-default tag-pill tag-outline">${item}</li>`
        )}
      </ul>
    `;
  }
}

window.customElements.define("c-tag-list", TagList);
