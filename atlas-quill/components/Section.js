import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
  .quill-section {
    padding: 0.5em;
    border: 1px solid black;
  }
`;

export const Section = ({ children }) => jsx`
  <section className="quill-section">
    ${children}
  </section>
`;
