import { html, map } from "./lit.js";

export const addErrorMessages = (messages, errors) =>
  messages.concat(
    Object.keys(errors).flatMap((k) => errors[k].map((m) => k + " " + m))
  );

export const renderErrorMessages = (messages) =>
  html`
    <ul class="error-messages">
      ${map(messages, (item) => html`<li>${item}</li>`)}
    </ul>
  `;
