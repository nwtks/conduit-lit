import { LitElement, html, classMap, map, range } from "../lit.js";
import { globalStyles } from "../style.js";

export class Pagination extends LitElement {
  static properties = {
    per: { type: Number },
    offset: { type: Number },
    total: { type: Number },
  };

  globalStyles = globalStyles();

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

  renderActive(offset) {
    return classMap({ "page-item": true, active: this.offset === offset });
  }

  render() {
    return html`
      ${this.globalStyles}
      <nav>
        <ul class="pagination">
          ${map(
            range(this.total / this.per),
            (i) => html`
              <li class=${this.renderActive(i)}>
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
