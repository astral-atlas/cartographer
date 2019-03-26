import { jsx, useState, useEffect, useContext } from '../lib/react.js';
import { Column } from './Column.js';
import { Header } from './Header.js';
import { Detail } from './Detail.js';
import { List } from './List.js';
import { Section } from './Section.js';
import { Form, Submit, TextInput } from './Form.js';
import { EventsColumn } from './EventsColumn.js';
import { ScribeStreamClientContext, ScribeClientContext } from './AtlasQuill.js';

const useChapterStream = (user) => {
  const client = useContext(ScribeStreamClientContext)
  const [chapters, setChapters] = useState(null);
  useEffect(() => (
    client && user && client.addChaptersListener(setChapters, user.id)
  ), [client, user]);
  return chapters || [];
};

const ChapterForm = ({ user }) => {
  const client = useContext(ScribeClientContext);
  const [chapterName, updateChapterName] = useState('');

  const onSubmit = () => {
    client.putNewChapter(chapterName, user.id);
    updateChapterName('');
  };

  return jsx`
    <${Form} onSubmit=${onSubmit}>
      <${Submit} buttonText="Submit new Chapter" />
      <${TextInput} labelText="Name" value=${chapterName} onChange=${updateChapterName} />
    <//>
  `;
};

export const ChaptersColumn = ({ user }) => {
  const chapters = useChapterStream(user);
  const [selectedChapter, selectChapter] = useState(null);
  const selectedChapterIndex = selectedChapter ? chapters.findIndex(chapter => chapter.id === selectedChapter.id) : -1;

  return jsx`
    <${Column} key="1">
      <${Header} headerText="Chapters by Name" />
      <${ChapterForm} user=${user} />
      <${List}
        items=${chapters.map(chapter => chapter.name)}
        selectedIndex=${selectedChapterIndex}
        onSelect=${newIndex => selectChapter(chapters[newIndex])}
      />
    <//>
    ${selectedChapterIndex !== -1 && selectedChapter && jsx`
      <${Column} key="2">
        <${Header} headerText="Chapter" />
        <${Section}>
          <${Detail} title="Name" description=${selectedChapter.name} />
          <${Detail} title="ID" description=${selectedChapter.id} />
          <${Detail} title="Read Permission" description=${selectedChapter.readPermission} />
          <${Detail} title="Master Permission" description=${selectedChapter.masterPermission} />
        <//>
      <//>
      <${EventsColumn} key="3" chapter=${selectedChapter} user=${user} />
    `}
  `;
};
