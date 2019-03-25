import { jsx, useState, useEffect, createContext } from '../lib/react.js';
import { css } from '../lib/style.js';

import { MetaList } from './MetaList.js';
import { ArraySelect, ArrayHeader, ArrayInsert } from './ArraySelect.js';

import { Description } from './UserDescription.js';

css`
  .atlas-quill {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .atlas-quill-heading {
    text-align: center;
    width: 100%;
  }
`;

const useUserStream = (streamClient) => {
  const [users, setUsers] = useState([]);

  useEffect(() => streamClient.addUsersListener(setUsers), [streamClient]);

  return users;
};

const useChapterStream = (streamClient, user) => {
  const [chapters, setChapters] = useState(null);
  useEffect(() => (
    user && streamClient.addChaptersListener(setChapters, user.id)
  ), [streamClient, user]);

  return chapters || [];
};

const useChapterByIdStream = (streamClient, user, selectedChapter) => {
  const DEFAULT_EMPTY_CHAPTER = { chapter: null , events: [] };
  const [chapter, setChapter] = useState(DEFAULT_EMPTY_CHAPTER);
  useEffect(() => (
    selectedChapter && user && streamClient.addChapterByIdListener(setChapter, user.id, selectedChapter.id)
  ), [streamClient, user, selectedChapter]);

  return (selectedChapter && user && chapter) ? chapter : DEFAULT_EMPTY_CHAPTER;
};

export const ScribeClientContext = createContext(null);
export const ScribeStreamClientContext = createContext(null);

export const AtlasQuill = ({ client, streamClient }) => {
  const users = useUserStream(streamClient);
  const [selectedUserId, selectUserId] = useState(null);
  const [selectedChapterId, selectChapterId] = useState(null);
  const selectedUserIndex = users.findIndex(user => user.id === selectedUserId);
  const selectedUser = users[selectedUserIndex];
  const chapters = useChapterStream(streamClient, selectedUser);
  const selectedChapterIndex = chapters.findIndex(chapter => chapter.id === selectedChapterId);
  const selectedChapter = chapters[selectedChapterIndex];

  const detailedChapter = useChapterByIdStream(streamClient, selectedUser, selectedChapter);

  const userListElement = jsx`
    <${ArrayHeader}
      key="0"
      headerText="Users"
      isValidItemSelected=${!!selectedUser}
    />
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
      isValidItemSelected=${!!selectedChapter}
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
      selectedItemIndex=${selectedChapterIndex}
      onItemSelect=${(selectedChapterIndex) => selectChapterId(chapters[selectedChapterIndex].id)}
    />
  `;

  const userDescElement = jsx`
    <${ArrayHeader}
      key="0"
      headerText="User"
      isValidItemSelected=${!!selectedUser}
    />
    ${selectedUser && jsx`
      <${Description}
        key="1"
        details=${[['User Name', selectedUser.name], ['User ID', selectedUser.id]]}
      />
    `}
  `;

  const chapterDescElement= jsx`
    <${ArrayHeader}
      key="0"
      headerText="Chapter"
      isValidItemSelected=${!!detailedChapter.chapter}
    />
    ${detailedChapter.chapter && jsx`
      <${Description}
        key="1"
        details=${[
          ['Name', detailedChapter.chapter.name],
          ['ID', detailedChapter.chapter.id],
          ['Master Permission ID', detailedChapter.chapter.masterPermission],
          ['Read Permission ID', detailedChapter.chapter.readPermission],
        ]}
      />
    `}
  `;

  const chapterEventsList = jsx`
    <${ArrayHeader}
      key="0"
      headerText="Events"
      isValidItemSelected=${!!detailedChapter.chapter}
    />
    ${detailedChapter.chapter && jsx`
      <${ArrayInsert}
        key="1"
        labelText="Add New Chapter Event"
        onInsert=${narration => client.putNewChapterEvent(detailedChapter.chapter.id, selectedUser.id, { type: 'narrate', narration })}}
      />
    `}
    <${ArraySelect}
      key="2"
      items=${detailedChapter.events.map(event => event.id)}
    />
  `;

  const listElements = [
    userListElement,
    userDescElement,
    chapterListElement,
    chapterDescElement,
    chapterEventsList,
  ];

  return jsx`
    <main className="atlas-quill">
      <h1 className="atlas-quill-heading">Atlas Quill<//>
      <${MetaList} listElements=${listElements} />
    <//>
  `;
};
