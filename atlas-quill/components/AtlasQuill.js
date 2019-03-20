import { Component, jsx } from '../lib/react.js';
import { css } from '../lib/style.js';

import { QuillHorizontalMenu } from './QuillHorizontalMenu.js';

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

export class AtlasQuill extends Component {
  state = {
    users: [],
    selectedUserIndex: -1,
  };
  usersUnsubscribe = null;

  componentDidMount() {
    this.usersUnsubscribe = this.props.streamClient.addUsersListener(users => this.onUsersUpdate(users));
  }

  componentWillUnmount() {
    this.usersUnsubscribe();
  }

  onUsersUpdate(users) {
    if (users !== this.state.users) {
      this.setState(state => ({ ...state, users, selectedUserIndex: -1 }));
    }
  }

  render() {
    const selectUser = (selectedUserIndex) => (
      this.setState(state => ({ ...state, selectedUserIndex }))
    );

    return jsx`
      <main className="atlas-quill">
        <h1 className="atlas-quill-heading">Atlas Quill<//>
        <${QuillHorizontalMenu}
          users=${this.state.users}
          selectedUserIndex=${this.state.selectedUserIndex}
          selectUser=${selectUser}
        />
      <//>
    `;
  }
}
