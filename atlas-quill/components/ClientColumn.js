import { jsx, useState } from '../lib/react.js';

import { ScribeClientContext, ScribeStreamClientContext } from './AtlasQuill.js';
import { Column } from './Column.js';
import { Header } from './Header.js';
import { Detail } from './Detail.js';
import { List, ListButton } from './List.js';
import { UsersColumn } from './UsersColumn.js';
import { Form, Submit, TextInput } from './Form.js';

import { createAtlasStreamClient } from '../services/atlasStreamClient.js';
import { createAtlasClient } from '../services/atlasClient.js';

const ClientForm = ({ onClientSubmit }) => {
  const [newClient, updateNewClient] = useState('');

  const onSubmit = () => {
    onClientSubmit(newClient);
    updateNewClient('');
  };

  return jsx`
    <${Form} onSubmit=${onSubmit}>
      <${Submit} buttonText="Submit new Client" />
      <${TextInput} labelText="Client Endpoint" value=${newClient} onChange=${updateNewClient} />
    <//>
  `;
};

const DEFAULT_CLIENTS = [
  'http://localhost:8888',
  'http://atlas-scribe-test.wxsnssrzip.ap-southeast-2.elasticbeanstalk.com/',
];

export const ClientColumn = () => {
  const [clients, updateClients] = useState(DEFAULT_CLIENTS);
  const [selectedClient, selectClient] = useState('http://localhost:8888');

  const atlasClient = createAtlasClient(selectedClient);
  const atlasStreamClient = createAtlasStreamClient(atlasClient);

  return jsx`
    <${Column} key="1">
      <${Header} headerText="Clients" />
      <${ClientForm} onClientSubmit=${newClient => updateClients([...clients, newClient])} />
      <${List}>
        ${clients.map((client) => jsx`
          <${ListButton}
            key=${client}
            onSelect=${() => selectClient(client)}
            selected=${selectedClient && (client === selectedClient)}
          >
            <${Detail} title="Client Endpoint" description=${client} />
          <//>
        `)}
      <//>
    <//>
    ${selectedClient && jsx`
      <${ScribeClientContext.Provider} key="2" value=${atlasClient}>
        <${ScribeStreamClientContext.Provider} value=${atlasStreamClient}>
          <${UsersColumn} />
        <//>
      <//>
    `}
  `;
};
