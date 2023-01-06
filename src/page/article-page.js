import { LitElement, html, map, when, unsafeHTML } from "../lit.js";
import { marked } from "../marked.js";
import "../component/navbar.js";
import "../component/footer.js";
import "../component/article-meta.js";
import "../component/tag-list.js";
import { importStyles } from "../style.js";
import { fetchGet, fetchPost, fetchDelete } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { formatDate } from "../format.js";
import { no_image } from "../config.js";

export class ArticlePage extends LitElement {
  static properties = {
    auth: { type: Object },
    slug: { type: String },
    article: { type: Object },
    comments: { type: Array },
    comment: { type: String },
    errorMessages: { type: Array },
  };

  connectedCallback() {
    super.connectedCallback();
    this.fetchArticle();
    this.fetchComments();
  }

  async fetchArticle() {
    this.errorMessages = [];
    const res = await fetchGet(
      "articles/" + encodeURIComponent(this.slug),
      {},
      true
    );
    if (res.article) {
      this.article = res.article;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  async fetchComments() {
    this.comments = null;
    this.errorMessages = [];
    const res = await fetchGet(
      "articles/" + encodeURIComponent(this.slug) + "/comments",
      {}
    );
    if (res.comments) {
      this.comments = res.comments;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  async postComment() {
    const body = (this.comment || "").trim();
    if (body) {
      this.errorMessages = [];
      const res = await fetchPost(
        "articles/" + encodeURIComponent(this.slug) + "/comments",
        { comment: { body } },
        true
      );
      if (res.comment) {
        this.comment = "";
        this.fetchComments();
      } else if (res.errors) {
        this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
      }
    }
  }

  async deleteComment(commentId) {
    this.errorMessages = [];
    const res = await fetchDelete(
      "articles/" +
        encodeURIComponent(this.slug) +
        "/comments/" +
        encodeURIComponent(commentId),
      {},
      true
    );
    if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    } else {
      this.fetchComments();
    }
  }

  render() {
    return html`
      ${importStyles()}
      <c-navbar .auth=${this.auth}></c-navbar>
      <div class="article-page">
        <div class="banner">
          <div class="container">${this.renderArticleBanner()}</div>
        </div>
        <div class="container page">
          ${renderErrorMessages(this.errorMessages)}${this.renderArticle()}
          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">
              ${this.renderCommentForm()}${this.renderComments()}
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }

  renderArticleBanner() {
    if (!this.article) {
      return html`<p>Loading article...</p>`;
    }
    return html`
      <h1>${this.article.title || ""}</h1>
      <c-article-meta
        .auth=${this.auth}
        .article=${this.article}
        actions
      ></c-article-meta>
    `;
  }

  renderArticle() {
    if (!this.article) {
      return;
    }
    return html`
      <div class="row article-content">
        <div class="col-md-12">
          ${unsafeHTML(marked.parse(this.article.body))}
          <c-tag-list .tags=${this.article.tagList}></c-tag-list>
        </div>
      </div>
      <hr />
      <div class="article-actions">
        <c-article-meta
          .auth=${this.auth}
          .article=${this.article}
          actions
        ></c-article-meta>
      </div>
    `;
  }

  renderCommentForm() {
    if (this.auth) {
      return html`
        <form class="card comment-form">
          <div class="card-block">
            <textarea
              class="form-control"
              placeholder="Write a comment..."
              rows="3"
              .value=${this.comment || ""}
              @change=${(e) => (this.comment = e.target.value)}
            ></textarea>
          </div>
          <div class="card-footer">
            <img
              class="comment-author-img"
              src=${this.auth.image || no_image}
            />
            <button
              class="btn btn-sm btn-primary"
              @click=${(e) => {
                e.preventDefault();
                this.postComment();
              }}
            >
              Post comment
            </button>
          </div>
        </form>
      `;
    }
    return html`
      <p>
        <a href="#/login">Sign in</a>
        or
        <a href="#/register">sign up</a>
        to add comments on this article.
      </p>
    `;
  }

  renderComments() {
    if (!this.comments) {
      return html`<p>Loading comments...</p>`;
    }
    return html`${map(
      this.comments,
      (item) => html`
        <div class="card">
          <div class="card-block">
            <p class="card-text">${item.body || ""}</p>
          </div>
          <div class="card-footer">
            <a class="comment-author" href="#/profile/${item.author.username}">
              <img
                class="comment-author-img"
                src=${item.author.image || no_image}
              />&#160;${item.author.username}
            </a>
            <span class="date-posted">${formatDate(item.createdAt)}</span>
            ${when(
              this.auth && this.auth.username === item.author.username,
              () => html`
                <span class="mod-options">
                  <i
                    class="ion-trash-a"
                    @click=${(e) => {
                      e.preventDefault();
                      this.deleteComment(item.id);
                    }}
                  ></i>
                </span>
              `
            )}
          </div>
        </div>
      `
    )}`;
  }
}

window.customElements.define("c-article-page", ArticlePage);
