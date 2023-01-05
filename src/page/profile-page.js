import {
  LitElement,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import "../component/article-previews.js";
import "../component/pagination.js";
import { fetchGet, fetchPost, fetchDelete } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";
import { no_image } from "../config.js";

export class ProfilePage extends LitElement {
  static properties = {
    auth: { type: Object },
    username: { type: String },
    profile: { type: Object },
    articles: { type: Array },
    articlesCount: { type: Number },
    article: { type: String },
    offset: { type: Number },
    errorMessages: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchProfile();
    this.fetchMyArticles();
  }

  fetchMyArticles() {
    this.article = "author";
    this.offset = 0;
    this.fetchArticles(
      "?limit=5&offset=0&author=" + encodeURIComponent(this.username)
    );
  }

  fetchFavoritedArticles() {
    this.article = "favorited";
    this.offset = 0;
    this.fetchArticles(
      "?limit=5&offset=0&favorited=" + encodeURIComponent(this.username)
    );
  }

  fetchPage(offset) {
    this.offset = offset;
    if (this.article === "favorited") {
      this.fetchArticles(
        "?limit=5&offset=" +
          offset +
          "&favorited=" +
          encodeURIComponent(this.username)
      );
    } else {
      this.fetchArticles(
        "?limit=5&offset=" +
          offset +
          "&author=" +
          encodeURIComponent(this.username)
      );
    }
  }

  async fetchArticles(params) {
    this.articles = null;
    this.articlesCount = 0;
    this.errorMessages = [];
    const res = await fetchGet("articles" + params, true);
    if (res.articles) {
      this.articles = res.articles;
      this.articlesCount = res.articlesCount;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  async fetchProfile() {
    this.errorMessages = [];
    const res = await fetchGet(
      "profiles/" + encodeURIComponent(this.username),
      true
    );
    if (res.profile) {
      this.profile = res.profile;
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  async toggleFollow() {
    if (this.auth) {
      if (this.profile.following) {
        this.errorMessages = [];
        const res = await fetchDelete(
          "profiles/" + encodeURIComponent(this.profile.username) + "/follow",
          true
        );
        if (res.profile) {
          this.profile = res.profile;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
      } else {
        this.errorMessages = [];
        const res = await fetchPost(
          "profiles/" + encodeURIComponent(this.profile.username) + "/follow",
          {},
          true
        );
        if (res.profile) {
          this.profile = res.profile;
        } else if (res.errors) {
          this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
        }
      }
    } else {
      location.hash = "#/login";
    }
  }

  renderActive(article) {
    return this.article === article ? "active" : "";
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth} path="profile"></c-navbar>
      <div class="profile-page">
        <div class="user-info">
          <div class="container">${this.renderProfile()}</div>
        </div>
        <div class="container">
          ${renderErrorMessages(this.errorMessages)}
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">
                  <li class="nav-item">
                    <a
                      class="nav-link ${this.renderActive("author")}"
                      href=""
                      @click=${(e) => {
                        e.preventDefault();
                        this.fetchMyArticles();
                      }}
                    >
                      My articles
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link ${this.renderActive("favorited")}"
                      href=""
                      @click=${(e) => {
                        e.preventDefault();
                        this.fetchFavoritedArticles();
                      }}
                    >
                      Favorited articles
                    </a>
                  </li>
                </ul>
              </div>
              <c-article-previews
                .auth=${this.auth}
                .articles=${this.articles}
              ></c-article-previews>
              <c-pagination
                per="5"
                .offset=${this.offset}
                .total=${this.articlesCount}
                @paging=${(e) => this.fetchPage(e.detail.offset)}
              ></c-pagination>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }

  renderProfile() {
    if (!this.profile) {
      return html`<p>Loading profile...</p>`;
    }
    return html`
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img class="user-img" src=${this.profile.image || no_image} />
          <h4>${this.profile.username}</h4>
          <p>${this.profile.bio || ""}</p>
          ${this.renderProfileAction()}
        </div>
      </div>
    `;
  }

  renderProfileAction() {
    if (this.auth && this.profile.username === this.auth.username) {
      return html`
        <a
          class="btn btn-sm btn-outline-secondary action-btn"
          href="#/settings"
        >
          <i class="ion-gear-a"></i>&#160;Edit profile settings
        </a>
      `;
    }
    return html`
      <button
        class="btn btn-sm action-btn ${this.profile.following
          ? "btn-secondary"
          : "btn-outline-secondary"}"
        @click=${(e) => {
          e.preventDefault();
          this.toggleFollow();
        }}
      >
        <i class="ion-plus-round"></i>&#160;${this.profile.following
          ? "Unfollow"
          : "Follow"}
        ${this.profile.username}
      </button>
    `;
  }
}

window.customElements.define("c-profile-page", ProfilePage);
