import { render, jsx } from './lib/react.js';
import { AtlasQuill } from './components/AtlasQuill.js';
import { createAtlasStreamClient } from './services/atlasStreamClient.js';
import { createAtlasClient } from './services/atlasClient.js';

const atlasClient = createAtlasClient('http://localhost:8888');
const atlasStreamClient = createAtlasStreamClient(atlasClient);

export const runAtlasQuill = (
  domRoot = document.body.appendChild(document.createElement('span')),
) => {
  const reactRoot = jsx`
    <${AtlasQuill}
      streamClient=${atlasStreamClient}
      client=${atlasClient}
    />
  `;
  return render(reactRoot, domRoot);
};
