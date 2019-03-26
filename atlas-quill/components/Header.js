import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';
import { cx } from '../lib/classNames.js';

css`
  .quill-header {
    text-align: center;
    margin: 0;
    padding: 1em;
  }
  .quill-header-selected {
    background: #fdf1cb;
  }
`;

export const Header = ({
  selected = false,
  headerText = '',
}) => jsx`
  <h3 className=${cx(
    'array-select-heading',
    { 'array-select-heading-selected': selected }
  )}>
    ${headerText}
  <//>
`;
