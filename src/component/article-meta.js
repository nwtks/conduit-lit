import {
  LitElement,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import { fetchPost, fetchDelete } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { formatDate } from "../format.js";
import { no_image } from "../config.js";

export class ArticleMeta extends LitElement {
  static properties = {
    auth: { type: Object },
    article: { type: Object },
    actions: { type: Boolean },
    errorMessages: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  async delete() {
    this.errorMessages = [];
    const res = await fetchDelete(
      "articles/" + encodeURIComponent(this.article.slug),
      true
    );
    if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    } else {
      location.hash = "#/";
    }
  }

  async toggleFollow() {
    if (this.auth) {
      if (this.article.author.following) {
        this.errorMessages = [];
        const res = await fetchDelete(
          "profiles/" +
            encodeURIComponent(this.article.author.username) +
            "/follow",
          true
        );
        if (res.profile) {
          this.article.author.following = res.profile.following;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
      } else {
        this.errorMessages = [];
        const res = await fetchPost(
          "profiles/" +
            encodeURIComponent(this.article.author.username) +
            "/follow",
          {},
          true
        );
        if (res.profile) {
          this.article.author.following = res.profile.following;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
      }
    } else {
      location.hash = "#/login";
    }
  }

  async toggleFavorite() {
    if (this.auth) {
      if (this.article.favorited) {
        this.errorMessages = [];
        const res = await fetchDelete(
          "articles/" + encodeURIComponent(this.article.slug) + "/favorite",
          true
        );
        if (res.article) {
          this.article = res.article;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
      } else {
        this.errorMessages = [];
        const res = await fetchPost(
          "articles/" + encodeURIComponent(this.article.slug) + "/favorite",
          {},
          true
        );
        if (res.article) {
          this.article = res.article;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
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
          <span class="date">${formatDate(this.article.createdAt)}</span>
        </div>
        ${renderErrorMessages(this.errorMessages)}${this.renderAction()}
      </div>
    `;
  }

  renderAction() {
    if (this.actions) {
      if (this.auth && this.auth.username === this.article.author.username) {
        return html`
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
              @click=${(e) => {
                e.preventDefault();
                this.delete();
              }}
            >
              <i class="ion-trash-a"></i>&#160;Delete article
            </button>
          </span>
        `;
      }
      return html`
        <button
          class="btn btn-sm ${this.article.following
            ? "btn-secondary"
            : "btn-outline-secondary"}"
          @click=${(e) => {
            e.preventDefault();
            this.toggleFollow();
          }}
        >
          <i class="ion-plus-round"></i>&#160;${this.article.author.following
            ? "Unfollow"
            : "Follow"}
          ${this.article.author.username}
        </button>
        &#160;&#160;
        <button
          class="btn btn-sm ${this.article.favorited
            ? "btn-primary"
            : "btn-outline-primary"}"
          @click=${(e) => {
            e.preventDefault();
            this.toggleFavorite();
          }}
        >
          <i class="ion-heart"></i>&#160;${this.article.favorited
            ? "Unfavorite"
            : "Favorite"}
          article&#160;<span class="counter"
            >(${this.article.favoritesCount})</span
          >
        </button>
      `;
    }
    return html`
      <button
        class="btn btn-sm pull-xs-right ${this.article.favorited
          ? "btn-primary"
          : "btn-outline-primary"}"
        @click=${(e) => {
          e.preventDefault();
          this.toggleFavorite();
        }}
      >
        <i class="ion-heart"></i>&#160;<span class="counter"
          >(${this.article.favoritesCount})</span
        >
      </button>
    `;
  }
}

window.customElements.define("c-article-meta", ArticleMeta);
