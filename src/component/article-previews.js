import {
  LitElement,
  html,
  map,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "./article-meta.js";
import "./tag-list.js";
import { importStyles } from "../style.js";

export class ArticlePreviews extends LitElement {
  static properties = {
    auth: { type: Object },
    articles: { type: Array },
  };

  render() {
    if (!this.articles) {
      return html`
        ${importStyles()}
        <div class="article-preview">Loading articles...</div>
      `;
    }
    if (!this.articles.length) {
      return html`
        ${importStyles()}
        <div class="article-preview">No articles are here... yet.</div>
      `;
    }
    return html`
      ${importStyles()}
      ${map(
        this.articles,
        (item) => html`
          <div class="article-preview">
            <c-article-meta
              .auth=${this.auth}
              .article=${item}
            ></c-article-meta>
            <a class="preview-link" href="#/article/${item.slug}">
              <h1>${item.title || ""}</h1>
              <p>${item.description || ""}</p>
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
