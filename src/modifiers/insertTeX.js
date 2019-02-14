import {
  Modifier,
  EditorState,
} from 'draft-js';
import { isAtEndOfBlock } from './utils';

export default function insertTeX(editorState, initialValue) {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();

  let teX = '';

  if (!selection.isCollapsed()) {
    const blockKey = selection.getStartKey();
    if (blockKey === selection.getEndKey()) {
      teX = contentState.getBlockForKey(blockKey)
        .getText()
        .slice(
          selection.getStartOffset(),
          selection.getEndOffset(),
        );
    }
    contentState = Modifier.removeRange(
      contentState,
      selection,
      'backward',
    );
    selection = contentState.getSelectionAfter();
  }

  if (initialValue) {
    teX = initialValue;
  }
  contentState = contentState.createEntity(
    'KateX_Inline',
    'IMMUTABLE',
    {
      teX,
      displaystyle: false,
    },
  );
  const entityKey = contentState.getLastCreatedEntityKey();

  // insérer un espace si le curseur se trouve au début ou à la fin
  // d'un bloc
  const atBeginOfBlock = selection.getStartOffset() === 0;
  const atEndOfBlock = isAtEndOfBlock(contentState, selection);

  if (atBeginOfBlock) {
    contentState = Modifier.insertText(
      contentState,
      selection,
      ' ',
    );
    selection = contentState.getSelectionAfter();
  }

  contentState = Modifier.insertText(
    contentState,
    selection,
    '\t\t',
    undefined,
    entityKey,
  );
  selection = contentState.getSelectionAfter();

  if (atEndOfBlock) {
    contentState = Modifier.insertText(
      contentState,
      selection,
      ' ',
    );
  }

  return EditorState.push(
      editorState,
      contentState,
      'apply-entity',
    );
}

