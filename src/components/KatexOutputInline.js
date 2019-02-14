import React from 'react';
import PropTypes from 'prop-types';

export default class KatexOutputInline extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    katex: PropTypes.object.isRequired,
    displayMode: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    onClick: () => {
    },
  };

  constructor(props) {
    super(props);
    this.timer = null;
  }

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  update = () => {
    const { katex } = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      katex.render(this.props.value, this.container, {
        displayMode: this.props.displayMode,
      });
    }, 0);
  };

  render() {
    const { theme } = this.props;
    return (
      <span
        className={theme}
        ref={container => {
          this.container = container;
        }}
        onClick={this.props.onClick}
      />
    );
  }
}
