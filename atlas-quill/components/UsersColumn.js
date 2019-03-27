import { jsx, useState, useEffect, useContext } from '../lib/react.js';

import { Column } from './Column.js';
import { Header } from './Header.js';
import { Detail } from './Detail.js';
import { List, ListButton } from './List.js';
import { Section } from './Section.js';
import { ScribeStreamClientContext } from './AtlasQuill.js';
import { ChaptersColumn } from './ChaptersColumn.js';

const useUserStream = () => {
  const client = useContext(ScribeStreamClientContext)
  const [users, setUsers] = useState(null);
  useEffect(() => client.addUsersListener(setUsers), [client]);
  return users || [];
};

export const UsersColumn = () => {
  const users = useUserStream();
  const [selectedUser, selectUser] = useState(null);
  const selectedUserIndex = selectedUser ? users.findIndex(user => user.id === selectedUser.id) : -1;

  return jsx`
    <${Column} key="1">
      <${Header} headerText="Users by Name" />
      <${List}>
        ${users.map((user) => jsx`
          <${ListButton}
            key=${user.id}
            onSelect=${() => selectUser(user)}
            selected=${selectedUser && (user.id === selectedUser.id)}
          >
            <${Detail} title="Name" description=${user.name} />
            <${Detail} title="ID" description=${user.id} />
          <//>
        `)}
      <//>
    <//>
    ${selectedUserIndex !== -1 && selectedUser && jsx`
      <${Column} key="2">
        <${Header} headerText="User" />
        <${Section}>
          <${Detail} title="Name" description=${selectedUser.name} />
          <${Detail} title="ID" description=${selectedUser.id} />
        <//>
      <//>
      <${ChaptersColumn} key="3" user=${selectedUser} />
    `}
  `;
};
