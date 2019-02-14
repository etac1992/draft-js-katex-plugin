import React, { Component } from 'react';
import unionClassNames from 'union-class-names';

import { finishEdit, saveTeX } from '../modifiers/utils';
import KatexOutputInline from './KatexOutputInline';

export default class TeXInline extends Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.update = (key) => {
      if (this.state.editMode) return;
      const { store } = this.props;
      this.setState({ editMode: true }, () => {
        store.setReadOnly(true);
        if (key) { store.teXToUpdate = {}; }
      });
    };

    this.onChange = (newState, cb = () => {}) => {
      this.setState(newState, cb);
    };

    this.getCaretPos = () => {
      const { store } = this.props;
      const { dir } = store.teXToUpdate;
      if (!dir || dir === 'l') { return this.state.teX.length; }
      return 0;
    };

    this.save = (after = 1) => {
      this.setState({ editMode: false }, () => {
        const { teX } = this.state;
        const { entityKey, offsetKey, children, store } = this.props;
        const contentState = this.getCurrentEditorContent();
        finishEdit(store)(
          ...saveTeX({
            after,
            contentState,
            teX,
            entityKey,
            blockKey: offsetKey.split('-')[0],
            ...React.Children.map(children, c => ({
              startPos: c.props.start,
            }))[0],
          }),
        );
      });
    };
    this.remove = (after = 1) => {
      this.setState({ editMode: false, teX: '' }, () => {
        const { teX } = this.state;
        const { entityKey, offsetKey, children, store } = this.props;
        const contentState = this.getCurrentEditorContent();
        finishEdit(store)(
          ...saveTeX({
            after,
            contentState,
            teX,
            entityKey,
            blockKey: offsetKey.split('-')[0],
            ...React.Children.map(children, c => ({
              startPos: c.props.start,
            }))[0],
          }),
        );
      });
    };
  }

  getInitialState(entityKey = this.props.entityKey) {
    const contentState = this.getCurrentEditorContent();
    const entity = contentState.getEntity(entityKey);
    const { teX } = entity.getData();
    return { editMode: teX.length === 0, teX };
  }

  componentWillMount() {
    const { store } = this.props;
    if (this.state.editMode) {
      store.setReadOnly(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { entityKey } = nextProps;
    const { store } = nextProps;
    const { key } = store.teXToUpdate;
    if (key === entityKey) {
      this.update(key);
    }
    if (this.props.entityKey === entityKey) { return; }
    const newInternalState = this.getInitialState(entityKey);
    this.setState(
      newInternalState,
      () =>
      newInternalState.editMode &&
      store.setReadOnly(true),
    );
  }

  getCurrentEditorContent() {
    const { store } = this.props;
    return store.getEditorState().getCurrentContent();
  }

  render() {
    const { editMode, teX } = this.state;
    const { katex, theme, doneContent, removeContent } = this.props;

    let input = null;
    let texContent = teX;
    let className = theme.tex;
    if (editMode) {
      className = unionClassNames(className, theme.activeTeX);
      let buttonClass = theme.saveButton;

      let invalidTeX = false;
      try {
        katex.__parse(texContent); // eslint-disable-line no-underscore-dangle
      } catch (e) {
        buttonClass = unionClassNames(buttonClass, theme.invalidButton);
        texContent = '';
        invalidTeX = true;
      }
      input = (
        <div className={theme.panel}>
          <textarea
            className={theme.texValue}
            onChange={(e) => this.onChange({ teX: e.target.value })}
            value={teX}
          />
          <div className={theme.buttons}>
            <button className={buttonClass} disabled={invalidTeX} onClick={this.save}>
              {invalidTeX ? doneContent.invalid : doneContent.valid}
            </button>
            <button className={theme.removeButton} onClick={this.remove}>
              {removeContent}
            </button>
          </div>
        </div>
      );
    }

    const rendered = (
      <KatexOutputInline
        katex={katex}
        value={texContent}
        theme={theme.katexInline}
        displayMode
      />
    );
    return (
      <span className={className}>
        <span
          onMouseDown={() => this.update()}
          contentEditable={false}
        >
          {rendered}
        </span>
        {input}
      </span>
    );
  }
}
