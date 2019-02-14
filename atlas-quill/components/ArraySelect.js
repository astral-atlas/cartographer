import { jsx } from '../lib/react.js';
import { noop } from '../lib/func.js';
import { css } from '../lib/style.js';
import { cx } from '../lib/classNames.js';

css`
  .array-select-section {
    border: 1px solid black;
  }
  .array-select-heading {
    text-align: center;
    margin: 0;
    padding: 1em;
  }
  .array-select-heading-selected {
    background: #fdf1cb;
  }
  .array-select-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .array-select-list-element {
    width: 100%;
    border: solid 1px black;
    border-bottom: none;
  }
  .array-select-list-element-button {
    padding: 1em;
    width: 100%;
    background: none;
    border: none;
  }
  .array-select-list-element-button-selected {
    background: #fdf1cb;
    font-weight: bold;
    color: black;
  }
  .array-select-list-element-button:focus,
  .array-select-list-element-button:hover {
    background: #b7ffd2;
    color: black;
  }
`;

export const ArraySelect = ({ items = [], selectedItemIndex = -1, onItemSelect = noop, title = 'Items' }) => jsx`
  <section className="array-select-section">
    <h1 className=${cx('array-select-heading', { 'array-select-heading-selected': selectedItemIndex !== -1 })}>
      ${title}
    </h1>
    <ul className="array-select-list">
      ${items.map((item, index) => jsx`
        <li key=${index} className="array-select-list-element">
          <button
            className=${cx(
              'array-select-list-element-button',
              { 'array-select-list-element-button-selected': selectedItemIndex === index }
            )}
            type="button"
            onClick=${() => onItemSelect(selectedItemIndex === index ? -1 : index)}
          >
            ${item}
          </button>
        </li>
      `)}
    </ul>
  </section>
`;
