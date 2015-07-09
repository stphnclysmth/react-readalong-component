var React = require("react");

var ReadablePhrase = React.createClass({
	propTypes: {
		speak: React.PropTypes.func.isRequired,
		release: React.PropTypes.func.isRequired
	},
	
  render: function() {
  	return <span className="readalong-phrase" onMouseMove={this.props.speak} onMouseOut={this.props.release} ariaHidden="true">{this.props.children}</span>;
  }
});

module.exports = ReadablePhrase;
