import { LitElement, html, map } from "../lit.js";
import { importStyles } from "../style.js";

export class TagList extends LitElement {
  static properties = {
    tags: { type: Array },
  };

  render() {
    return html`
      ${importStyles()}
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
