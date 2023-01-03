import { LitElement, html } from "lit";
import { when } from "lit/directives/when.js";
import { fetchPost, fetchDelete } from "../fetch";
import { no_image } from "../config";

export class ArticleMeta extends LitElement {
  static properties = {
    auth: { type: Object },
    article: { type: Object },
    actions: { type: Boolean },
  };

  createRenderRoot() {
    return this;
  }

  delete(e) {
    e.preventDefault();
    fetchDelete("articles/" + encodeURIComponent(this.article.slug), true).then(
      (r) => {
        location.hash = "#/";
      }
    );
  }

  toggleFollow(e) {
    e.preventDefault();
    if (this.auth) {
      if (this.article.author.following) {
        fetchDelete(
          "profiles/" +
            encodeURIComponent(this.article.author.username) +
            "/follow",
          true
        ).then((r) => {
          fetchArticle();
        });
      } else {
        fetchPost(
          "profiles/" +
            encodeURIComponent(this.article.author.username) +
            "/follow",
          "{}",
          true
        ).then((r) => {
          fetchArticle();
        });
      }
    } else {
      location.hash = "#/login";
    }
  }

  toggleFavorite(e) {
    e.preventDefault();
    if (this.auth) {
      if (this.article.favorited) {
        fetchDelete(
          "articles/" + encodeURIComponent(this.article.slug) + "/favorite",
          true
        ).then((r) => {
          9;
          this.article = r.article;
        });
      } else {
        fetchPost(
          "articles/" + encodeURIComponent(this.article.slug) + "/favorite",
          "{}",
          true
        ).then((r) => {
          this.article = r.article;
        });
      }
    } else {
      location.hash = "#/login";
    }
  }

  render() {
    return html`
      <div class="article-meta">
        <a href="#/profile/${this.article.author.username}">
          <img src=${this.article.author.image || no_image} />
        </a>
        <div class="info">
          <a class="author" href="#/profile/${this.article.author.username}">
            ${this.article.author.username}
          </a>
          <span class="date">${this.article.createdAt || ""}</span>
        </div>
        ${when(
          this.actions,
          () => html`
            ${when(
              this.auth && this.auth.username === this.article.author.username,
              () => html`
                <span>
                  <a
                    class="btn btn-outline-secondary btn-sm"
                    href="#/editor/${this.article.slug}"
                  >
                    <i class="ion-edit"></i>&#160;Edit article
                  </a>
                  &#160;&#160;
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click=${this.delete}
                  >
                    <i class="ion-trash-a"></i>&#160;Delete article
                  </button>
                </span>
              `,
              () => html`
                <button
                  class="btn btn-sm ${this.article.following
                    ? "btn-secondary"
                    : "btn-outline-secondary"}"
                  @click=${this.toggleFollow}
                >
                  <i class="ion-plus-round"></i>&#160;${this.article.author
                    .following
                    ? "Unfollow"
                    : "Follow"}
                  ${this.article.author.username}
                </button>
                &#160;&#160;
                <button
                  class="btn btn-sm ${this.article.favorited
                    ? "btn-primary"
                    : "btn-outline-primary"}"
                  @click=${this.toggleFavorite}
                >
                  <i class="ion-heart"></i>&#160;${this.article.favorited
                    ? "Unfavorite"
                    : "Favorite"}
                  article&#160;<span class="counter"
                    >(${this.article.favoritesCount})</span
                  >
                </button>
              `
            )}
          `,
          () => html`
            <button
              class="btn btn-sm pull-xs-right ${this.article.favorited
                ? "btn-primary"
                : "btn-outline-primary"}"
              @click=${this.toggleFavorite}
            >
              <i class="ion-heart"></i>&#160;<span class="counter"
                >(${this.article.favoritesCount})</span
              >
            </button>
          `
        )}
      </div>
    `;
  }
}

window.customElements.define("c-article-meta", ArticleMeta);
