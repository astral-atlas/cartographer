import { render, jsx } from './lib/react.js';
import { AtlasQuill } from './components/AtlasQuill.js';
import { createAtlasStreamClient } from './services/atlasStreamClient.js';
import { createAtlasClient } from './services/atlasClient.js';

const atlasStreamClient = createAtlasStreamClient(createAtlasClient('http://localhost:8888'));

export const runAtlasQuill = (
  rootElement = document.body.appendChild(document.createElement('span')),
) => {
  return render(jsx`<${AtlasQuill} streamClient=${atlasStreamClient} />`, rootElement);
};
