import { render, jsx } from './lib/react.js';
import { AtlasQuill } from './components/App.js';

export const runAtlasQuill = (
  rootElement = document.body.appendChild(document.createElement('span')),
) => {
  return render(jsx`<${AtlasQuill} />`, rootElement);
};
