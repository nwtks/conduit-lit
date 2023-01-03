import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";

export class Pagination extends LitElement {
  static properties = {
    per: { type: Number },
    offset: { type: Number },
    total: { type: Number },
  };

  createRenderRoot() {
    return this;
  }

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
      <nav>
        <ul class="pagination">
          ${map(
            range(this.total / this.per),
            (i) => html`
              <li class="page-item ${this.offset === i ? "active" : ""}">
                <a
                  class="page-link"
                  href=""
                  @click="${(e) => {
                    e.preventDefault();
                    this.paging(i);
                  }}"
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
