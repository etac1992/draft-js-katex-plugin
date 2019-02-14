import {
  getDefaultKeyBinding,
} from 'draft-js';

export function findInlineTeXEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'KateX_Inline'
      );
    },
    callback,
  );
}
export const myKeyBindingFn = getEditorState => (e) => {
  const c = getEditorState().getCurrentContent();
  const s = getEditorState().getSelection();

  const currentBlockKey = s.getAnchorKey();
  const currentBlock = c.getBlockForKey(currentBlockKey);
  const offset = s.getStartOffset();
  const text = currentBlock.getText();
  if (e.keyCode === 8 && offset >= 3) { // back
    const nextStr = text.substring(offset, offset + 2).replace(/\t/g, '');
    const prevStr = text.substring(offset - 3, offset - 1).replace(/\t/g, '');
    if (nextStr === '' && prevStr === '') {
      return 'replaceText';
    }
  }
  if (e.keyCode === 46) { // delete
    const nextStr = text.substring(offset + 1, offset + 3).replace(/\t/g, '');
    const prevStr = text.substring(offset - 2, offset).replace(/\t/g, '');
    if (nextStr === '' && prevStr === '') {
      return 'replaceText';
    }
  }
  return getDefaultKeyBinding(e);
};
