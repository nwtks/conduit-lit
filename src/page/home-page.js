import {
  LitElement,
  html,
  map,
  when,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import "../component/article-previews.js";
import "../component/pagination.js";
import { fetchGet } from "../fetch.js";

export class HomePage extends LitElement {
  static properties = {
    auth: { type: Object },
    feed: { type: String },
    articles: { type: Array },
    articlesCount: { type: Number },
    offset: { type: Number },
    tag: { type: String },
    tags: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.auth) {
      this.fetchYourFeed();
    } else {
      this.fetchGlobalFeed();
    }
    this.fetchTags();
  }

  fetchYourFeed() {
    this.feed = "your";
    this.tag = null;
    this.offset = 0;
    this.fetchArticles("/feed?limit=10&offset=0", true);
  }

  fetchGlobalFeed() {
    this.feed = "global";
    this.tag = null;
    this.offset = 0;
    this.fetchArticles("?limit=10&offset=0");
  }

  fetchTagged(tag) {
    this.feed = null;
    this.tag = tag;
    this.offset = 0;
    this.fetchArticles("?limit=10&offset=0&tag=" + encodeURIComponent(tag));
  }

  fetchPage(offset) {
    this.offset = offset;
    if (this.tag) {
      this.fetchArticles(
        "?limit=10&offset=" + offset + "&tag=" + encodeURIComponent(this.tag)
      );
    } else if (this.feed === "your") {
      this.fetchArticles("/feed?limit=10&offset=" + offset, true);
    } else {
      this.fetchArticles("?limit=10&offset=" + offset);
    }
  }

  fetchArticles(params, reqAuth) {
    this.articles = null;
    this.articlesCount = 0;
    fetchGet("articles" + params, reqAuth).then((r) => {
      this.articles = r.articles;
      this.articlesCount = r.articlesCount;
    });
  }

  fetchTags() {
    this.tags = null;
    fetchGet("tags").then((r) => {
      this.tags = r.tags;
    });
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth} path="home"></c-navbar>
      <div class="home-page">
        <div class="banner">
          <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
        <div class="container page">
          <div class="row">
            <div class="col-md-9">
              <div class="feed-toggle">
                <ul class="nav nav-pills outline-active">
                  ${when(
                    this.auth,
                    () => html`
                      <li class="nav-item">
                        <a
                          class="nav-link ${this.feed === "your"
                            ? "active"
                            : ""}"
                          href=""
                          @click="${(e) => {
                            e.preventDefault();
                            this.fetchYourFeed();
                          }}"
                        >
                          Your feed
                        </a>
                      </li>
                    `
                  )}
                  <li class="nav-item">
                    <a
                      class="nav-link ${this.feed === "global" ? "active" : ""}"
                      href=""
                      @click="${(e) => {
                        e.preventDefault();
                        this.fetchGlobalFeed();
                      }}"
                    >
                      Global feed
                    </a>
                  </li>
                  ${when(
                    this.tag,
                    () => html`
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          href=""
                          @click="${(e) => {
                            e.preventDefault();
                            this.fetchTagged(this.tag);
                          }}"
                        >
                          <i class="ion-pound"></i>&#160;${this.tag}
                        </a>
                      </li>
                    `
                  )}
                </ul>
              </div>
              <c-article-previews
                .auth=${this.auth}
                .articles=${this.articles}
              ></c-article-previews>
              <c-pagination
                per="10"
                .offset=${this.offset}
                .total=${this.articlesCount}
                @paging="${(e) => this.fetchPage(e.detail.offset)}"
              ></c-pagination>
            </div>
            <div class="col-md-3">
              <div class="sidebar">
                <p>Popular tags</p>
                ${when(
                  !this.tags,
                  () => html`<p>Loading tags...</p>`,
                  () => html`
                    <div class="tag-list">
                      ${map(
                        this.tags,
                        (item) => html`
                          <a
                            class="tag-pill tag-default"
                            href=""
                            @click="${(e) => {
                              e.preventDefault();
                              this.fetchTagged(item);
                            }}"
                          >
                            ${item}
                          </a>
                        `
                      )}
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-home-page", HomePage);
