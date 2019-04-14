import { render, jsx } from './lib/react.js';
import { AtlasQuill } from './components/AtlasQuill.js';

export const runAtlasQuill = (
  domRoot = document.body.appendChild(document.createElement('span')),
) => {
  const reactRoot = jsx`
    <${AtlasQuill} />
  `;
  return render(reactRoot, domRoot);
};
