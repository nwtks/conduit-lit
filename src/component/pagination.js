import {
  LitElement,
  html,
  map,
  range,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import { importStyles } from "../style.js";

export class Pagination extends LitElement {
  static properties = {
    per: { type: Number },
    offset: { type: Number },
    total: { type: Number },
  };

  paging(offset) {
    this.dispatchEvent(
      new CustomEvent("paging", {
        detail: { offset },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
  }

  render() {
    return html`
      ${importStyles()}
      <nav>
        <ul class="pagination">
          ${map(
            range(this.total / this.per),
            (i) => html`
              <li class="page-item ${this.offset === i ? "active" : ""}">
                <a
                  class="page-link"
                  href=""
                  @click=${(e) => {
                    e.preventDefault();
                    this.paging(i);
                  }}
                >
                  ${i + 1}
                </a>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }
}

window.customElements.define("c-pagination", Pagination);
