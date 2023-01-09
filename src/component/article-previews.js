import { LitElement, html, map } from "../lit.js";
import "./article-meta.js";
import "./tag-list.js";
import { globalStyles } from "../style.js";

export class ArticlePreviews extends LitElement {
  static properties = {
    auth: { type: Object },
    articles: { type: Array },
  };

  globalStyles = globalStyles();

  render() {
    if (!this.articles) {
      return html`
        ${this.globalStyles}
        <div class="article-preview">Loading articles...</div>
      `;
    }
    if (!this.articles.length) {
      return html`
        ${this.globalStyles}
        <div class="article-preview">No articles are here... yet.</div>
      `;
    }
    return html`
      ${this.globalStyles}
      ${map(
        this.articles,
        (item) => html`
          <div class="article-preview">
            <c-article-meta
              .auth=${this.auth}
              .article=${item}
            ></c-article-meta>
            <a class="preview-link" href="#/article/${item.slug}">
              <h1>${item.title}</h1>
              <p>${item.description}</p>
              <span>Read more...</span>
              <c-tag-list .tags=${item.tagList}></c-tag-list>
            </a>
          </div>
        `
      )}
    `;
  }
}

window.customElements.define("c-article-previews", ArticlePreviews);
