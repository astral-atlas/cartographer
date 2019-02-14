import { render, jsx } from './lib/react.js';
import { AtlasQuill } from './components/AtlasQuill.js';

export const runAtlasQuill = (
  rootElement = document.body.appendChild(document.createElement('span')),
) => {
  return render(jsx`<${AtlasQuill} />`, rootElement);
};
