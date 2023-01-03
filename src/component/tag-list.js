import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";

export class TagList extends LitElement {
  static properties = {
    tags: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
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
