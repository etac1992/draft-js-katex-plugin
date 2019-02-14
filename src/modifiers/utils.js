import { SelectionState, EditorState, Modifier } from 'draft-js';

export function isAtEndOfBlock(contentState, selection) {
  const currentBlockKey = selection.getAnchorKey();
  const currentBlock = contentState.getBlockForKey(currentBlockKey);
  return currentBlock.getText().length === selection.getStartOffset();
}

export function isAtStartOfBlock(selection) {
  return selection.getStartOffset() === 0;
}

export function removeEntity(contentState, blockKey, start, end) {
  const selToRemove = SelectionState
    .createEmpty(blockKey)
    .merge({
      anchorOffset: start,
      focusOffset: end,
    });

  return Modifier.removeRange(
    contentState,
    selToRemove,
    'backward',
  );
}

export function finishEdit(store) {
  return (newContentState, newSelection, needRemove) => {
    store.setReadOnly(false);
    const newEditorState = EditorState.push(
      store.getEditorState(),
      newContentState,
      needRemove ? 'remove-range' : 'update-math',
    );

    if (newSelection !== undefined) {
      store.setEditorState(
        EditorState.forceSelection(
          newEditorState, newSelection,
        ),
      );
      store.setEditorState(EditorState.forceSelection(newEditorState, newEditorState.getSelection()));
    } else {
      store.setEditorState(newEditorState);
    }
  };
}

function saveInlineTeX({
  after,
  contentState,
  teX,
  entityKey,
  blockKey,
  startPos,
}) {
  const needRemove = teX.length === 0;
  let newContentState;
  let newSelection;

  if (needRemove) {
    newContentState = removeEntity(
      contentState, blockKey, startPos, startPos + 1,
    );
    newSelection = newContentState.getSelectionAfter();
  } else {
    newContentState = contentState.mergeEntityData(
      entityKey, { teX },
    );

    if (after !== undefined) {
      const offset = after ? startPos + 2 : startPos;
      newSelection = SelectionState.createEmpty(blockKey)
        .merge({
          anchorOffset: offset,
          focusOffset: offset,
          hasFocus: true,
        });
    }
  }
  const atEndOfBlock = isAtEndOfBlock(contentState, newSelection);
  if (atEndOfBlock) {
    newContentState = Modifier.insertText(
      newContentState,
      newSelection,
      ' ',
    );
  }
  return [newContentState, newSelection, needRemove];
}

export function saveTeX({
  entityKey,
  blockKey,
  startPos,
  ...common
}) {
  return saveInlineTeX({ ...common, entityKey, blockKey, startPos });
}
