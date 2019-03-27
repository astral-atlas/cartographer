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
  }
  .quill-list-element:last-child {
    border-bottom: solid 1px black;
  }
  .quill-list-element-button {
    padding: 0.5em;
    background: 0;
    border: 0;
    font-size: initial;
  }
  .quill-list-element-button-selected {
    background: #fdf1cb;
    color: black;
  }
  .quill-list-element-button:focus,
  .quill-list-element-button:hover {
    background: #b7ffd2;
    color: black;
  }
`;

export const List = ({
  children
}) => jsx`
  <ul className="quill-list">
    ${children}
  </ul>
`;

export const ListButton = ({
  children,
  onSelect = noop,
  selected = false,
}) => jsx`
  <li className="quill-list-element">
    <button
    className=${cx(
      'quill-list-element-button',
      { 'quill-list-element-button-selected': selected }
    )}
    type="button"
    onClick=${onSelect}
    >
    ${children}
    </button>
  </li>
`;
