import {
  LitElement,
  html,
  map,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
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
