import { jsx } from '../lib/react.js';

import { MetaList } from './MetaList.js';
import { ArraySelect } from './ArraySelect.js';

export const QuillHorizontalMenu = ({ users, selectedUserIndex, selectUser }) => {
  const userListElement = jsx`
    <${ArraySelect}
      items=${users.map(user => user.name)}
      selectedItemIndex=${selectedUserIndex}
      onItemSelect=${selectUser} 
    />
  `;

  const listElements = [userListElement];

  return jsx`
    <${MetaList} listElements=${listElements} />
  `;
};
