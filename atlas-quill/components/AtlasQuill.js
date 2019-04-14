import { jsx, createContext } from '../lib/react.js';
import { css } from '../lib/style.js';

import { Row } from './Column.js';
import { ClientColumn } from './ClientColumn.js';
css`
  .atlas-quill {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .atlas-quill-heading {
    text-align: center;
    width: 100%;
  }
`;

export const ScribeClientContext = createContext(null);
export const ScribeStreamClientContext = createContext(null);

export const AtlasQuill = () => {
  return jsx`
    <main className="atlas-quill">
      <h1 className="atlas-quill-heading">Atlas Quill<//>
      <${Row}>
        <${ClientColumn}/>
      <//>
    <//>
  `;
};
