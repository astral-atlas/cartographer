import { jsx, Fragment } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
.quill-form {
  display: flex;
  flex-direction: column;
  background-color: #b7ffd2;
  border: 1px solid black;
}
.quill-form-text-input {
  border: 1px solid black;
  margin: 0.5em;
  height: 2em;
  padding: 0.5em;
}
.quill-form-submit {
  height: 2em;
  margin: 0.5em;
}
.quill-form-label {
  text-align: center;
  margin: 0.5em;
}
`;

export const Form = ({ onSubmit, children }) => jsx`
  <form
    className="quill-form"
    onSubmit=${(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    ${children}
  <//>
`;

export const Submit = ({ buttonText }) => jsx`
  <input
    type="submit"
    className="quill-form-submit"
    value=${buttonText}
  />
`;

export const Label = ({ labelText }) => jsx`
  <label className="quill-form-label">${labelText}<//>
`;

export const TextInput = ({ labelText, value, onChange }) => jsx`
  <${Fragment}>
    <${Label} labelText=${labelText} />
    <input
      className="quill-form-text-input"
      type="text"
      value=${value}
      onChange=${event => onChange(event.target.value)}
    />
  <//>
`;
