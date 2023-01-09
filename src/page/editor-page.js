import { LitElement, html, map } from "../lit.js";
import "../component/navbar.js";
import "../component/footer.js";
import { globalStyles } from "../style.js";
import { fetchGet, fetchPost, fetchPut } from "../fetch.js";
import { addErrorMessages, renderErrorMessages } from "../error.js";

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

  globalStyles = globalStyles();

  connectedCallback() {
    super.connectedCallback();
    this.tag = "";
    if (this.slug) {
      this.fetchArticle();
    } else {
      this.title = "";
      this.description = "";
      this.body = "";
      this.tags = [];
    }
  }

  async fetchArticle() {
    this.errorMessages = [];
    const res = await fetchGet(
      `articles/${encodeURIComponent(this.slug)}`,
      {},
      true
    );
    if (res.article) {
      this.title = res.article.title || "";
      this.description = res.article.description || "";
      this.body = res.article.body || "";
      this.tags = res.article.tagList || [];
    } else if (res.errors) {
      this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
    }
  }

  addTag(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const newTag = this.tag.trim();
      this.tag = "";
      if (newTag) {
        this.tags.push(newTag);
      }
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((v) => v !== tag);
  }

  async submit() {
    const data = {
      article: {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tags,
      },
    };
    if (this.slug) {
      this.errorMessages = [];
      const res = await fetchPut(
        `articles/${encodeURIComponent(this.slug)}`,
        data,
        true
      );
      if (res.article) {
        location.hash = `#/article/${res.article.slug}`;
      } else if (res.errors) {
        this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
      }
    } else {
      this.errorMessages = [];
      const res = await fetchPost("articles", data, true);
      if (res.article) {
        location.hash = `#/article/${res.article.slug}`;
      } else if (res.errors) {
        this.errorMessages = addErrorMessages(this.errorMessages, res.errors);
      }
    }
  }

  render() {
    return html`
      ${this.globalStyles}
      <c-navbar .auth=${this.auth} path="editor"></c-navbar>
      <div class="editor-page">
        <div class="container page">
          <div class="row">
            <div class="col-md-10 offset-md-1 col-xs-12">
              ${renderErrorMessages(this.errorMessages)}${this.renderForm()}
            </div>
          </div>
        </div>
      </div>
      <c-footer></c-footer>
    `;
  }

  renderForm() {
    if (this.title == null) {
      return html`<p>Loading article...</p>`;
    }
    return html`
      <form>
        <fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="text"
              placeholder="Article title"
              .value=${this.title}
              @change=${(e) => (this.title = e.target.value)}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control"
              type="text"
              placeholder="What's this article about?"
              .value=${this.description}
              @change=${(e) => (this.description = e.target.value)}
            />
          </fieldset>
          <fieldset class="form-group">
            <textarea
              class="form-control"
              rows="8"
              placeholder="Write your article (in markdown)"
              .value=${this.body}
              @change=${(e) => (this.body = e.target.value)}
            ></textarea>
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control"
              type="text"
              placeholder="Enter tags"
              .value=${this.tag}
              @keypress=${this.addTag}
              @input=${(e) => (this.tag = e.target.value)}
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
    `;
  }
}

window.customElements.define("c-editor-page", EditorPage);
