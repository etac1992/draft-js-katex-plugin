import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import unionClassNames from 'union-class-names';
import insertTeX from '../modifiers/insertTeX';

export default class InsertKatexInlineButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    initialValue: PropTypes.string,
    theme: PropTypes.any,
  };

  static defaultProps = {
    initialValue: null,
    tex: null,
    theme: null,
    children: null
  };

  onClick = () => {
    const { store, initialValue } = this.props;
    const editorState = store.getEditorState();
    store.setEditorState(insertTeX(editorState, initialValue));
  };

  render() {
    const { theme = {}, className, children, defaultContent } = this.props;
    const combinedClassName = unionClassNames(theme.insertButton, className);
    const content = Children.count(children) ? children : defaultContent;

    return (
      <button className={combinedClassName} onClick={this.onClick} type="button">
        {content}
      </button>
    );
  }
}
