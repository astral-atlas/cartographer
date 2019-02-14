import { jsx } from '../lib/react.js';
import { style } from '../lib/style.js';

style`
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
    left: -1px;
    margin-right: -1px;
  }
  .meta-list-element:last-child {
    margin-right: 0px;
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
