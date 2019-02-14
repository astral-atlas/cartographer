import { jsx } from '../lib/react.js';
import { noop } from '../lib/func.js';
import { ArraySelect } from './ArraySelect.js';

export const ChapterSelect = ({ chapters = [], selectedChapterIndex = -1, onChapterSelect = noop }) => jsx`
  <${ArraySelect}
    title="Chapters"
    items=${chapters}
    selectedItemIndex=${selectedChapterIndex}
    onItemSelect=${onChapterSelect}
  />
`;
