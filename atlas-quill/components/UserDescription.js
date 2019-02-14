import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
  .description-article {
    border: 1px solid black;
  }
  .description-heading {
    text-align: center;
  }
  .description-text {
    text-align: center;
    padding: 1em;
  }
`;

export const UserDescription = ({ user = '' }) => jsx`
  <article className="description-article">
    <h3 className="description-heading">${user}</h3>
    <p className="description-text">A user of the site.</p>
  </article>
`;
