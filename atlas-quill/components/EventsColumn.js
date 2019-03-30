import { jsx, useState, useEffect, useContext } from '../lib/react.js';
import { Column } from './Column.js';
import { Header } from './Header.js';
import { Detail } from './Detail.js';
import { List, ListButton } from './List.js';
import { Form, Submit, TextInput } from './Form.js';
import { ScribeStreamClientContext, ScribeClientContext } from './AtlasQuill.js';

const userChapterEventsStream = (user, chapter) => {
  const client = useContext(ScribeStreamClientContext)
  const [events, setEvents] = useState(null);
  useEffect(() => (
    client && user && chapter && client.addChapterEventsListener(setEvents, user.id, chapter.id)
  ), [client, chapter, user]);
  return events || [];
};

const EventForm = ({ user, chapter }) => {
  const client = useContext(ScribeClientContext);
  const [narration, updateNarration] = useState('');

  const onSubmit = () => {
    client.putNewChapterEvent(chapter.id, user.id, { type: 'narrate', narration: '' });
    updateNarration('');
  };

  return jsx`
    <${Form} onSubmit=${onSubmit}>
      <${Submit} buttonText="Submit new Event" />
      <${TextInput} labelText="Narration" value=${narration} onChange=${updateNarration} />
    <//>
  `;
};

export const EventsColumn = ({ user, chapter }) => {
  const events = userChapterEventsStream(user, chapter);
  const [selectedEvent, selectEvent] = useState();

  return jsx`
    <${Column} key="1">
      <${Header} headerText="Chapter Events" />
      <${EventForm} user=${user} chapter=${chapter} />
      <${List}>
        ${events.map((event) => jsx`
          <${ListButton}
            key=${event.id}
            onSelect=${() => selectEvent(events)}
            selected=${selectedEvent && (event.id === selectedEvent.id)}
          >
            <${Detail} title="ID" description=${event.id} />
            <${Detail} title="ChapterID" description=${event.chapterId} />
            <${Detail} title="Type" description=${event.type} />
            <${Detail} title="Narration" description=${event.narration} />
          <//>
        `)}
      <//>
    <//>
  `;
};
