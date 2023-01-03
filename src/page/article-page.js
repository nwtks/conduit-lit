import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import "../component/navbar";
import "../component/footer";
import "../component/article-meta";
import "../component/tag-list";
import { fetchGet, fetchPost, fetchDelete } from "../fetch";
import { formatDate } from "../format";
import { no_image } from "../config";

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

  postComment(e) {
    e.preventDefault();
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
          <div class="container">
            ${when(
              this.article,
              () => html`
                <h1>${this.article.title || ""}</h1>
                <c-article-meta
                  .auth=${this.auth}
                  .article=${this.article}
                  actions
                ></c-article-meta>
              `
            )}
          </div>
        </div>
        <div class="container page">
          ${when(
            this.article,
            () => html`
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
            `
          )}
          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">
              ${when(
                this.auth,
                () => html`
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
                        @click=${this.postComment}
                      >
                        Post comment
                      </button>
                    </div>
                  </form>
                `,
                () => html`
                  <p>
                    <a href="#/login">Sign in</a>
                    or
                    <a href="#/register">sign up</a>
                    to add comments on this article.
                  </p>
                `
              )}
              ${when(
                !this.comments,
                () => html`<p>Loading comments...</p>`,
                () =>
                  map(
                    this.comments,
                    (item) => html`
                      <div class="card">
                        <div class="card-block">
                          <p class="card-text">${item.body || ""}</p>
                        </div>
                        <div class="card-footer">
                          <a
                            class="comment-author"
                            href="#/profile/${item.author.username}"
                          >
                            <img
                              class="comment-author-img"
                              src=${item.author.image || no_image}
                            />&#160;${item.author.username}
                          </a>
                          <span class="date-posted"
                            >${formatDate(item.createdAt)}</span
                          >
                          ${when(
                            this.auth &&
                              this.auth.username === item.author.username,
                            () => html`
                              <span class="mod-options">
                                <i
                                  class="ion-trash-a"
                                  @click="${(e) => {
                                    e.preventDefault();
                                    this.deleteComment(item.id);
                                  }}"
                                ></i>
                              </span>
                            `
                          )}
                        </div>
                      </div>
                    `
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-article-page", ArticlePage);
