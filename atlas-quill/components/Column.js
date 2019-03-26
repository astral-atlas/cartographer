import { css } from '../lib/style.js';
import { jsx } from '../lib/react.js';

css`
.quill-row {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow: auto;
}
.quill-column {
  min-width: 15em;
  display: flex;
  flex-direction: column;
}
`;

export const Row = ({ children }) => jsx`
  <section className="quill-row">
    ${children}
  <//>
`;

export const Column = ({ children }) => jsx`
  <div className="quill-column">
    ${children}
  <//>
`;
