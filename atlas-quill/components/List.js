import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';
import { noop } from '../lib/func.js';
import { cx } from '../lib/classNames.js';

css`
  .quill-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .quill-list-element {
    border: solid 1px black;
    border-bottom: none;
    height: 3em;
  }
  .quill-list-element:last-child {
    border-bottom: solid 1px black;
  }
  .quill-list-element-button {
    padding: 1em;
    width: 100%;
    height: 100%;
    background: 0;
    border: 0;
  }
  .quill-list-element-button-selected {
    background: #fdf1cb;
    font-weight: bold;
    color: black;
  }
  .quill-list-element-button:focus,
  .quill-list-element-button:hover {
    background: #b7ffd2;
    color: black;
  }
`;

export const List = ({
  items,
  selectedIndex = -1,
  onSelect = noop,
}) => jsx`
  <ul className="quill-list">
    ${items.map((item, index) => jsx`
      <li key=${index} className="quill-list-element">
        <button
          className=${cx(
            'quill-list-element-button',
            { 'quill-list-element-button-selected': selectedIndex === index }
          )}
          type="button"
          onClick=${() => onSelect(index)}
        >
          ${item}
        </button>
      </li>
    `)}
  </ul>
`;
