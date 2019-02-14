import React, { Component } from 'react';
import asciimath2latex from 'asciimath-to-latex';
import { EditorState } from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-math-emoji-plugin';

import MathInput from 'math-input/dist/components/app';

import 'draft-js-math-emoji-plugin/lib/plugin.css';

import createKaTeXPlugin from '../src/index';
import '../src/styles.css';

import katex from '../src/katex';

const katexTheme = {
  insertButton: 'Button Button-small Button-insert',
};
const emojiPlugin = createEmojiPlugin();
const { EmojiSelect } = emojiPlugin;

function configuredEditor(props) {
  const kaTeXPlugin = createKaTeXPlugin({
    // the configs here are mainly to show you that it is possible. Feel free to use w/o config
    doneContent: { valid: 'Close', invalid: 'Invalid syntax' },
    katex, // <-- required
    MathInput: props.withMathInput ? MathInput : null,
    removeContent: 'Remove',
    theme: katexTheme,
    translator: props.withAsciimath ? asciimath2latex : null,
  });

  const plugins = [kaTeXPlugin, emojiPlugin];

  const baseEditorProps = Object.assign({
    plugins,
  });

  return { baseEditorProps, InsertButton: kaTeXPlugin.InsertButton, InsertKatexInlineButton: kaTeXPlugin.InsertKatexInlineButton };
}

export default class ConfiguredEditor extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    const { baseEditorProps, InsertButton, InsertKatexInlineButton } = configuredEditor(props);
    this.baseEditorProps = baseEditorProps;
    this.InsertButton = InsertButton;
    this.InsertKatexInlineButton = InsertKatexInlineButton;
    this.state = { editorState: EditorState.createEmpty() };
  }

  // use this when triggering a button that only changes editorstate
  onEditorStateChange = editorState => {
    this.setState(() => ({ editorState }));
  };

  render() {
    const { InsertButton, InsertKatexInlineButton } = this;

    return (
      <div>
        <h1>DraftJS KaTeX Plugin</h1>
        <div style={{ border: '#ccc 1px solid', background: '#ccc', padding: 10 }}>
          <InsertKatexInlineButton initialValue="int(s-x)^3">Insert ascii math</InsertKatexInlineButton>
          <InsertButton initialValue="int(s-x)^3">Insert ascii math</InsertButton>
        </div>
        <Editor
          plugins={this.baseEditorProps.plugins}
          editorState={this.state.editorState}
          onChange={this.onEditorStateChange}
        />
        <EmojiSelect />
      </div>
    );
  }
}
