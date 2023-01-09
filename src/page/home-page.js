import { LitElement, html, classMap, when, map } from "../lit.js";
import "../component/navbar.js";
import "../component/footer.js";
import "../component/article-previews.js";
import "../component/pagination.js";
import { globalStyles } from "../style.js";
import { fetchGet } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";

export class HomePage extends LitElement {
  static properties = {
    auth: { type: Object },
    articles: { type: Array },
    articlesCount: { type: Number },
    tags: { type: Array },
    feed: { type: String },
    tag: { type: String },
    offset: { type: Number },
    errorMessages: { type: Array },
  };

  globalStyles = globalStyles();

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
    this.fetchArticles("/feed", { limit: 10, offset: 0 }, true);
  }

  fetchGlobalFeed() {
    this.feed = "global";
    this.tag = null;
    this.offset = 0;
    this.fetchArticles("", { limit: 10, offset: 0 });
  }

  fetchTagged(tag) {
    this.feed = null;
    this.tag = tag;
    this.offset = 0;
    this.fetchArticles("", { limit: 10, offset: 0, tag });
  }

  fetchPage(offset) {
    this.offset = offset;
    if (this.tag) {
      this.fetchArticles("", { limit: 10, offset, tag: this.tag });
    } else if (this.feed === "your") {
      this.fetchArticles("/feed", { limit: 10, offset }, true);
    } else {
      this.fetchArticles("", { limit: 10, offset });
    }
  }

  async fetchArticles(path, params, reqAuth) {
    this.articles = null;
    this.articlesCount = 0;
    this.errorMessages = [];
    const res = await fetchGet(`articles${path}`, params, reqAuth);
    if (res.articles) {
      this.articles = res.articles;
      this.articlesCount = res.articlesCount;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  async fetchTags() {
    this.tags = null;
    this.errorMessages = [];
    const res = await fetchGet("tags", {});
    if (res.tags) {
      this.tags = res.tags;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  renderActive(feed) {
    return classMap({ "nav-link": true, active: this.feed === feed });
  }

  render() {
    return html`
      ${this.globalStyles}
      <c-navbar .auth=${this.auth} path="home"></c-navbar>
      <div class="home-page">
        <div class="banner">
          <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
        <div class="container page">
          ${renderErrorMessages(this.errorMessages)}
          <div class="row">
            <div class="col-md-9">
              <div class="feed-toggle">
                <ul class="nav nav-pills outline-active">
                  ${when(
                    this.auth,
                    () => html`
                      <li class="nav-item">
                        <a
                          class=${this.renderActive("your")}
                          href=""
                          @click=${(e) => {
                            e.preventDefault();
                            this.fetchYourFeed();
                          }}
                        >
                          Your feed
                        </a>
                      </li>
                    `
                  )}
                  <li class="nav-item">
                    <a
                      class=${this.renderActive("global")}
                      href=""
                      @click=${(e) => {
                        e.preventDefault();
                        this.fetchGlobalFeed();
                      }}
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
                          @click=${(e) => {
                            e.preventDefault();
                            this.fetchTagged(this.tag);
                          }}
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
                @paging=${(e) => this.fetchPage(e.detail.offset)}
              ></c-pagination>
            </div>
            <div class="col-md-3">
              <div class="sidebar">
                <p>Popular tags</p>
                ${this.renderTags()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }

  renderTags() {
    if (!this.tags) {
      return html`<p>Loading tags...</p>`;
    }
    return html`
      <div class="tag-list">
        ${map(
          this.tags,
          (item) => html`
            <a
              class="tag-pill tag-default"
              href=""
              @click=${(e) => {
                e.preventDefault();
                this.fetchTagged(item);
              }}
            >
              ${item}
            </a>
          `
        )}
      </div>
    `;
  }
}

window.customElements.define("c-home-page", HomePage);
