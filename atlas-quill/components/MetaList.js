import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
  .meta-list {
    display: flex;
    flex-direction: row;
    height: 100%;
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: auto;
  }
  .meta-list-element {
    max-width: 15em;
    min-width: 15em;
    flex: 1;
  }
`;

export const MetaList = ({ listElements = [] }) => jsx`
  <ul className="meta-list">
    ${listElements.map((element, index) => jsx`
      <li key=${index} className="meta-list-element">
        ${element}
      </li>
    `)}
  </ul>
`;
