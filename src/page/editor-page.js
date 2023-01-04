import {
  LitElement,
  html,
  map,
} from "https://cdn.jsdelivr.net/gh/lit/dist/all/lit-all.min.js";
import "../component/navbar.js";
import "../component/footer.js";
import { fetchGet, fetchPost, fetchPut } from "../fetch.js";

export class EditorPage extends LitElement {
  static properties = {
    auth: { type: Object },
    slug: { type: String },
    title: { type: String },
    description: { type: String },
    body: { type: String },
    tag: { type: String },
    tags: { type: Array },
    errorMessages: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.slug) {
      this.fetchArticle();
    }
  }

  fetchArticle() {
    fetchGet("articles/" + encodeURIComponent(this.slug), true).then((r) => {
      this.title = r.article.title || "";
      this.description = r.article.description || "";
      this.body = r.article.body || "";
      this.tags = r.article.tagList;
    });
  }

  addTag(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const newTag = (this.tag || "").trim();
      this.tag = "";
      if (newTag) {
        if (!this.tags) {
          this.tags = [];
        }
        this.tags.push(newTag);
      }
    } else {
      this.tag = e.target.value;
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((v) => v !== tag);
  }

  submit() {
    const data = {
      article: {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tags,
      },
    };
    this.errorMessages = [];
    if (this.slug) {
      fetchPut(
        "articles/" + encodeURIComponent(this.slug),
        JSON.stringify(data),
        true
      ).then((r) => {
        if (r.errors) {
          this.errorMessages = Object.keys(r.errors).flatMap((k) =>
            r.errors[k].map((m) => k + " " + m)
          );
        } else {
          location.hash = "#/article/" + r.article.slug;
        }
      });
    } else {
      fetchPost("articles", JSON.stringify(data), true).then((r) => {
        if (r.errors) {
          this.errorMessages = Object.keys(r.errors).flatMap((k) =>
            r.errors[k].map((m) => k + " " + m)
          );
        } else {
          location.hash = "#/article/" + r.article.slug;
        }
      });
    }
  }

  render() {
    return html`
      <c-navbar .auth=${this.auth} path="editor"></c-navbar>
      <div class="editor-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-10 offset-md-1 col-xs-12">
              <ul class="error-messages">
                ${map(this.errorMessages, (item) => html`<li>${item}</li>`)}
              </ul>
              <form>
                <fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control form-control-lg"
                      type="text"
                      placeholder="Article title"
                      .value=${this.title || ""}
                      @change=${(e) => (this.title = e.target.value)}
                    />
                  </fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      .value=${this.description || ""}
                      @change=${(e) => (this.description = e.target.value)}
                    />
                  </fieldset>
                  <fieldset class="form-group">
                    <textarea
                      class="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      .value=${this.body || ""}
                      @change=${(e) => (this.body = e.target.value)}
                    ></textarea>
                  </fieldset>
                  <fieldset class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Enter tags"
                      .value=${this.tag || ""}
                      @keydown=${this.addTag}
                    />
                    <div class="tag-list">
                      ${map(
                        this.tags,
                        (item) => html`
                          <span class="tag-default tag-pill">
                            <i
                              class="ion-close-round"
                              @click=${(e) => {
                                e.preventDefault();
                                this.removeTag(item);
                              }}
                            ></i
                            >&#160;${item}
                          </span>
                        `
                      )}
                    </div>
                  </fieldset>
                  <button
                    class="btn btn-lg pull-xs-right btn-primary"
                    @click=${(e) => {
                      e.preventDefault();
                      this.submit();
                    }}
                  >
                    Publish article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }
}

window.customElements.define("c-editor-page", EditorPage);
