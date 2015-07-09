var React = require("react");

var Phrase = React.createClass({
	propTypes: {
		speak: React.PropTypes.func.isRequired
	},
	
  render: function() {
  	return <span className="speakable-phrase" onMouseMove={this.props.speak} onMouseOut={this.props.release} ariaHidden="true">{this.props.children}</span>;
  }
});

module.exports = Phrase;
