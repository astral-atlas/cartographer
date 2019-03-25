import { jsx, Fragment } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
  .quill-detail-title {
    text-align: center;
    margin: 0.2em;
    text-decoration: underline;
  }
  .quill-detail-description {
    text-align: center;
    margin: 0.2em;
  }
`;

export const Detail = ({ title, description }) => jsx`
  <${Fragment}>
    <h4 className="quill-detail-title">${title}</h4>
    <p className="quill-detail-description">${description}</p>
  <//>
`;
