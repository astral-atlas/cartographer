import { jsx, createContext } from '../lib/react.js';
import { css } from '../lib/style.js';

import { Row } from './Column.js';
import { UsersColumn } from './UsersColumn.js';
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

export const AtlasQuill = ({ client, streamClient }) => {
  return jsx`
    <${ScribeClientContext.Provider} value=${client}>
      <${ScribeStreamClientContext.Provider} value=${streamClient}>
        <main className="atlas-quill">
          <h1 className="atlas-quill-heading">Atlas Quill<//>
          <${Row}>
            <${UsersColumn}/>
          <//>
        <//>
      <//>
    <//>
  `;
};
