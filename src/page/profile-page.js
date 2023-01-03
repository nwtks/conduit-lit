import { LitElement, html } from "lit";
import { when } from "lit/directives/when.js";
import "../component/navbar";
import "../component/footer";
import "../component/article-previews";
import "../component/pagination";
import { fetchGet, fetchPost, fetchDelete } from "../fetch";
import { no_image } from "../config";

export class ProfilePage extends LitElement {
  static properties = {
    auth: { type: Object },
    username: { type: String },
    profile: { type: Object },
    article: { type: String },
    articles: { type: Array },
    articlesCount: { type: Number },
    offset: { type: Number },
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

  fetchArticles(params) {
    this.articles = null;
    this.articlesCount = 0;
    fetchGet("articles" + params, !!this.auth).then((r) => {
      this.articles = r.articles;
      this.articlesCount = r.articlesCount;
    });
  }

  fetchProfile() {
    fetchGet("profiles/" + encodeURIComponent(this.username), !!this.auth).then(
      (r) => {
        this.profile = r.profile;
      }
    );
  }

  toggleFollow(e) {
    e.preventDefault();
    if (this.auth) {
      if (this.profile.following) {
        fetchDelete(
          "profiles/" + encodeURIComponent(this.profile.username) + "/follow",
          true
        ).then((r) => {
          this.profile = r.profile;
        });
      } else {
        fetchPost(
          "profiles/" + encodeURIComponent(this.profile.username) + "/follow",
          "{}",
          true
        ).then((r) => {
          this.profile = r.profile;
        });
      }
    } else {
      location.hash = "#/login";
    }
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth} path="profile"></c-navbar>
      <div class="profile-page">
        <div class="user-info">
          <div class="container">
            ${when(
              this.profile,
              () => html`
                <div class="row">
                  <div class="col-xs-12 col-md-10 offset-md-1">
                    <img
                      class="user-img"
                      src=${this.profile.image || no_image}
                    />
                    <h4>${this.profile.username}</h4>
                    <p>${this.profile.bio || ""}</p>
                    ${when(
                      this.auth && this.profile.username === this.auth.username,
                      () => html`
                        <a
                          class="btn btn-sm btn-outline-secondary action-btn"
                          href="#/settings"
                        >
                          <i class="ion-gear-a"></i>&#160;Edit profile settings
                        </a>
                      `,
                      () => html`
                        <button
                          class="btn btn-sm action-btn ${this.profile.following
                            ? "btn-secondary"
                            : "btn-outline-secondary"}"
                          @click=${this.toggleFollow}
                        >
                          <i class="ion-plus-round"></i>&#160;${this.profile
                            .following
                            ? "Unfollow"
                            : "Follow"}
                          ${this.profile.username}
                        </button>
                      `
                    )}
                  </div>
                </div>
              `
            )}
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">
                  <li class="nav-item">
                    <a
                      class="nav-link ${this.article === "author"
                        ? "active"
                        : ""}"
                      href=""
                      @click="${(e) => {
                        e.preventDefault();
                        this.fetchMyArticles();
                      }}"
                    >
                      My articles
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link ${this.article === "favorited"
                        ? "active"
                        : ""}"
                      href=""
                      @click="${(e) => {
                        e.preventDefault();
                        this.fetchFavoritedArticles();
                      }}"
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
                @paging="${(e) => this.fetchPage(e.detail.offset)}"
              ></c-pagination>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-profile-page", ProfilePage);
