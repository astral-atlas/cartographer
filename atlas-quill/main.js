import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';
import htm from 'https://dev.jspm.io/htm';
import cx from 'https://dev.jspm.io/classnames';

const h = htm.bind(React.createElement);
const { render } = ReactDOM;
const { Component } = React;

const jFetch = async (...args) => {
  const response = await fetch(...args);
  const parsedBody = await response.json();
  return parsedBody;
};

class Users extends Component {
  state = {
    users: [],
  };

  async componentDidMount() {
    const users = await jFetch('http://localhost:8888/users');
    this.setState({ users });
  }

  render() {
    const { selectedUsers, onUserSelect } = this.props;
    const { users } = this.state;

    const handleChange = currentUser => event => onUserSelect(
      users.filter(user => {
        const isCurrentUser = user.id === currentUser.id;
        if (!isCurrentUser) {
          return selectedUsers.find(selectedUser => selectedUser.id === user.id);
        }
        return event.target.checked;
      })
    );

    return h`
        <ul className="quill-user-list quill-list">
          ${users.map(user => {
            const isSelected = !!selectedUsers.find(selectedUser => selectedUser.id === user.id);
            return h`
              <li
                className=${cx('quill-list-entry', { 'quill-user-selected': isSelected })}
                key=${user.id}
              >
                <label htmlFor=${`quill-user-label-${user.id}`}>${user.name}</label>
                <input
                  id=${`quill-user-label-${user.id}`}
                  type="checkbox"
                  value=${isSelected}
                  onChange=${handleChange(user)}
                />
              </li>
            `;
          })}
        </ul>
    `;
  }
}

class Chapter extends Component {
  state = {
    chapters: [],
    newChapter: { chapterName: '' },
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.user.id !== this.props.user.id) {
      const chapters = await jFetch('http://localhost:8888/chapters', {
        headers: { User: this.props.user.name },
      });
      this.setState({ chapters });
    } 
  }

  async componentDidMount() {
    const chapters = await jFetch('http://localhost:8888/chapters', {
      headers: { User: this.props.user.name },
    });
    this.setState({ chapters });
  }

  render() {
    const { chapters, newChapter } = this.state;
    const handleNewChapterName = (event) => {
      const { value } = event.target;
      this.setState(oldState => ({
        ...oldState,
        newChapter: {
          ...oldState.newChapter,
          chapterName: value,
        }
      }))
    };
    const handleNewChapter = async (event) => {
      event.preventDefault();
      await jFetch('http://localhost:8888/chapters', {
        method: 'POST',
        body: JSON.stringify(newChapter),
        headers: { User: this.props.user.name },
      });
      const chapters = await jFetch('http://localhost:8888/chapters', {
        headers: { User: this.props.user.name },
      });
      this.setState({ chapters });
    };

    return h`
      <ul className="quill-user-list quill-list">
        <li className="quill-list-entry">
          <form onSubmit=${handleNewChapter}>
            <input type="text" value=${newChapter.chapterName} onChange=${handleNewChapterName}/>
            <input type="submit" />
          </form>
        </li>
        ${chapters.map(chapter => h`
          <li
            className="quill-list-entry"
            key=${chapter.id}
          >
            <label htmlFor=${`quill-user-label-${chapter.id}`}>${chapter.name}</label>
            <input
              id=${`quill-user-label-${chapter.id}`}
              type="checkbox"
            />
          </li>
        `)}
      </ul>
    `;
  }
}

class App extends Component {
  state = { selectedUsers: [] };

  render() {
    const { selectedUsers } = this.state;
    return h`
      <div className="quill-meta-list">
        <div className="quill-list-container">
          <h2 className="quill-list-title">Users</h2>
          <${Users}
            selectedUsers=${selectedUsers}
            onUserSelect=${selectedUsers => this.setState({ selectedUsers })}
          />
        </div>
        <div className="quill-list-container">
          <h2 className="quill-list-title">Chapters</h2>
          ${selectedUsers.map(user => h`
            <span key=${user.id}>
              <h3 className="quill-list-subtitle">${user.name}</h3>
              <${Chapter}
                user=${user}
              />
            </span>
          `)}
        </div>
      </div>
    `;
  }
}
const element = document.body.appendChild(document.createElement('main'));

render(h`<${App} />`, element);
