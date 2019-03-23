import { jsx, useState } from '../lib/react.js';
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
  }
  .array-select-list-element {
    border: solid 1px black;
    border-bottom: none;
    height: 3em;
  }
  .array-select-list-element:last-child {
    border-bottom: solid 1px black;
  }
  .array-select-list-element-button {
    padding: 1em;
    width: 100%;
    height: 100%;
    background: 0;
    border: 0;
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
  .array-insert-form {
    display: flex;
    flex-direction: column;
    background-color: #b7ffd2;
    border: 1px solid black;
    height: calc(6em);
  }
  .array-insert-input {
    border: 1px solid black;
    margin: 0.5em;
    height: 2em;
    padding: 0.5em;
  }
  .array-insert-submit {
    height: 2em;
    margin: 0.5em;
  }
`;

export const ArrayHeader = ({
  isValidItemSelected = false,
  headerText = '',
}) => jsx`
  <h3 className=${cx(
    'array-select-heading',
    { 'array-select-heading-selected': isValidItemSelected }
  )}>
    ${headerText}
  <//>
`;

export const ArrayInsert = ({
  onInsert = noop,
  labelText = '',
}) => {
  const [insertableText, setInsertableText] = useState('');
  return jsx`
    <form
      className="array-insert-form"
      onSubmit=${(event) => {
        event.preventDefault();
        onInsert(insertableText);
        setInsertableText('');
      }}
    >
      <input
        type="submit"
        className="array-insert-submit"
        value=${labelText}
      />
      <input
        className="array-insert-input"
        type="text"
        value=${insertableText}
        onChange=${event => setInsertableText(event.target.value)}
      />
    </form>
  `;
};

export const ArraySelect = ({
  items = [],
  selectedItemIndex = -1,
  onItemSelect = noop,
}) => jsx`
  <ul className="array-select-list">
    ${items.map((item, index) => jsx`
      <li key=${index} className="array-select-list-element">
        <button
          className=${cx(
            'array-select-list-element-button',
            { 'array-select-list-element-button-selected': selectedItemIndex === index }
          )}
          type="button"
          onClick=${() => onItemSelect(index)}
        >
          ${item}
        </button>
      </li>
    `)}
  </ul>
`;
