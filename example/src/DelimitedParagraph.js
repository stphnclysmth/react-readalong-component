var React = require('react');
var Readalong = require('react-component-readalong');

var DeliminatedParagraph = React.createClass({
	propTypes: {
		word: React.PropTypes.oneOf(["word", "sentence"])	
	},
	
	getInitialState: function () {
		return {
			delimiter: this.props.delimiter || "word",
			voices: [],
			voice: null
		}
	},

	updateDelimiter: function (event) {
		this.setState({
			delimiter: event.target.value
		});
	},

	updateVoice: function (event) {
		this.setState({
			voice: event.target.value
		});
	},

	updateVoices: function() {
		this.setState({
			voices: window.speechSynthesis.getVoices()
		});
	},

	componentWillMount: function () {
		window.speechSynthesis.addEventListener('voiceschanged', this.updateVoices, false);
	},

	componentWillUnmount: function () {
		window.speechSynthesis.removeEventListener('voiceschanged', this.updateVoices, false);
	},

	render: function () {
		var voiceOptions = this.state.voices.map(function (voice) {
			return <option key={voice.name} value={voice.name}>{voice.name}</option>;
		});

		return (
				<div>
					<div className="well well-sm">
						<form className="form">
							<div className="row">
								<div className="form-group col-lg-4">
									<label className="control-label">Delimiter</label>
									<select className="form-control" value={this.state.delimiter} onChange={this.updateDelimiter}>
										<option value="sentence">Sentence</option>
										<option value="word">Word</option>
									</select>
								</div>
		
								<div className="form-group col-lg-4">
									<label className="control-label">Voice</label>
									<select className="form-control" value={this.state.voice} onChange={this.updateVoice}>
										{voiceOptions}
									</select>
								</div>
								
								<div className="col-lg-4">
									
									<span className="help-block">The list of voices is populated by the voices available to your browser's SpeechSynthesis API.</span>
								</div>
							</div>
						</form>
					</div>

					<Readalong lang="en-US" voice={this.state.voice} delimiter={this.state.delimiter}>
						{this.props.children}
					</Readalong>
				</div>
		);
	}
});

module.exports = DeliminatedParagraph;
