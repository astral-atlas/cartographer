import { Component, jsx } from '../lib/react.js';
import { createStore, Provider } from '../lib/redux.js';
import { rootReducer } from '../reducers/root.js';

import { MetaList } from './MetaList.js';
import { UserSelect } from './UserSelect.js';
import { ChapterSelect } from './ChapterSelect.js';
import { UserDescription } from './UserDescription.js';

const appStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
};

const appHeadingStyle = {
  textAlign: 'center',
};

const users = [
  'luke',
  'fraser',
  'lincoln',
  'james',
  'brendan',
];

const chapters = [
  'Red Knight',
];

export class AtlasQuill extends Component {
  store = createStore(rootReducer);
  state = {
    selectedUserIndex: -1,
    selectedChapterIndex: -1,
  };

  render() {
    const { selectedUserIndex, selectedChapterIndex } = this.state;

    const selectedUser = users[selectedUserIndex];
    const selectedChapter = chapters[selectedChapterIndex];

    return jsx`
      <main style=${appStyle}>
        <${Provider} store=${this.store}>
          <h1 style=${appHeadingStyle}>Atlas Quill</h1>
          <${MetaList} listElements=${[
            jsx`
              <${UserSelect}
                users=${users}
                selectedUserIndex=${selectedUserIndex}
                onUserSelect=${selectedUserIndex => this.setState({ selectedUserIndex, selectedChapterIndex: -1 })}
              />
            `,
            selectedUser && jsx`<${UserDescription} user=${selectedUser} />`,
            selectedUser && jsx`
              <${ChapterSelect}
                chapters=${chapters}
                selectedChapterIndex=${selectedChapterIndex}
                onChapterSelect=${selectedChapterIndex => this.setState({ selectedChapterIndex })}
              />
            `,
            selectedChapter && jsx`<${UserDescription} user=${selectedChapter} />`,
          ].filter(Boolean)} />
        </${Provider}>
      </main>
    `;
  }
}
