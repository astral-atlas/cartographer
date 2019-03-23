import { jsx, useState, useEffect } from '../lib/react.js';
import { css } from '../lib/style.js';

import { MetaList } from './MetaList.js';
import { ArraySelect, ArrayHeader, ArrayInsert } from './ArraySelect.js';

css`
  .atlas-quill {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
  }
  .atlas-quill-heading {
    text-align: center;
  }
`;

const useUserStream = (streamClient) => {
  const [users, setUsers] = useState([]);

  useEffect(() => streamClient.addUsersListener(setUsers), [streamClient]);

  return users;
};

const useChapterStream = (streamClient, user) => {
  const [chapters, setChapters] = useState([]);
  useEffect(() => (
    user && streamClient.addChaptersListener(setChapters, user.id)
  ), [streamClient, user]);

  return chapters;
};

export const AtlasQuill = ({ streamClient, client }) => {
  const users = useUserStream(streamClient);
  const [selectedUserId, selectUserId] = useState(null);
  const selectedUserIndex = users.findIndex(user => user.id === selectedUserId);
  const selectedUser = users[selectedUserIndex];
  const chapters = useChapterStream(streamClient, selectedUser);

  const userListElement = jsx`
    <${ArrayHeader} key="0" headerText="Users" isValidItemSelected=${!!selectedUser} />
    <${ArraySelect}
      key="1"
      items=${users.map(user => user.name)}
      selectedItemIndex=${selectedUserIndex}
      onItemSelect=${(selectedUserIndex) => selectUserId(users[selectedUserIndex].id)} 
    />
  `;
  const chapterListElement = jsx`
    <${ArrayHeader}
      key="0"
      headerText="Chapters"
      isValidItemSelected=${false}
    />
    ${selectedUser && jsx`
      <${ArrayInsert}
        key="1"
        labelText="Add New Chapter"
        onInsert=${chapterName => client.putNewChapter(chapterName, selectedUser.id)}
      />
    `}
    <${ArraySelect}
      key="2"
      items=${chapters.map(chapter => chapter.name)}
      selectedItemIndex=${-1}
      onItemSelect=${() => {}} 
    />
  `;

  const listElements = [userListElement, chapterListElement];

  return jsx`
    <main className="atlas-quill">
      <h1 className="atlas-quill-heading">Atlas Quill<//>
      <${MetaList} listElements=${listElements} />
    <//>
  `;
};
