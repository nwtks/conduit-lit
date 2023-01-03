import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import "./article-meta";
import "./tag-list";

export class ArticlePreviews extends LitElement {
  static properties = {
    auth: { type: Object },
    articles: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.articles) {
      return html`<div class="article-preview">Loading articles...</div>`;
    }
    if (!this.articles.length) {
      return html`
        <div class="article-preview">No articles are here... yet.</div>
      `;
    }
    return html`${map(
      this.articles,
      (item) => html`
        <div class="article-preview">
          <c-article-meta .auth=${this.auth} .article=${item}></c-article-meta>
          <a class="preview-link" href="#/article/${item.slug}">
            <h1>${item.title || ""}</h1>
            <p>${item.description || ""}</p>
            <span>Read more...</span>
            <c-tag-list .tags=${item.tagList}></c-tag-list>
          </a>
        </div>
      `
    )}`;
  }
}

window.customElements.define("c-article-previews", ArticlePreviews);
