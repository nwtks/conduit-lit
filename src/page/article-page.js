import {
  LitElement,
  html,
  map,
  when,
  unsafeHTML,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import "../component/navbar.js";
import "../component/footer.js";
import "../component/article-meta.js";
import "../component/tag-list.js";
import { fetchGet, fetchPost, fetchDelete } from "../fetch.js";
import { formatDate } from "../format.js";
import { no_image } from "../config.js";

export class ArticlePage extends LitElement {
  static properties = {
    auth: { type: Object },
    slug: { type: String },
    article: { type: Object },
    comments: { type: Array },
    comment: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchArticle();
    this.fetchComments();
  }

  fetchArticle() {
    fetchGet("articles/" + encodeURIComponent(this.slug), !!this.auth).then(
      (r) => {
        this.article = r.article;
      }
    );
  }

  fetchComments() {
    this.comments = null;
    fetchGet("articles/" + encodeURIComponent(this.slug) + "/comments").then(
      (r) => {
        this.comments = r.comments;
      }
    );
  }

  postComment() {
    const newComment = (this.comment || "").trim();
    if (newComment && newComment.length) {
      fetchPost(
        "articles/" + encodeURIComponent(this.slug) + "/comments",
        JSON.stringify({
          comment: {
            body: newComment,
          },
        }),
        true
      ).then((r) => {
        this.comment = "";
        fetchComments();
      });
    }
  }

  deleteComment(commentId) {
    fetchDelete(
      "articles/" +
        encodeURIComponent(this.slug) +
        "/comments/" +
        encodeURIComponent(commentId),
      true
    ).then((r) => {
      fetchComments();
    });
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth}></c-navbar>
      <div class="article-page">
        <div class="banner">
          <div class="container">${this.renderArticleBanner()}</div>
        </div>
        <div class="container page">
          ${this.renderArticle()}
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
