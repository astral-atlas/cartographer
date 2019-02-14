import { jsx } from '../lib/react.js';
import { noop } from '../lib/func.js';
import { ArraySelect } from './ArraySelect.js';

export const UserSelect = ({ users = [], selectedUserIndex = -1, onUserSelect = noop }) => jsx`
  <${ArraySelect}
    title="Users"
    items=${users}
    selectedItemIndex=${selectedUserIndex}
    onItemSelect=${onUserSelect}
  />
`;
