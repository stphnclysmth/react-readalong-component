/**

 The MIT License (MIT)

 Copyright (c) 2015 Talking Bibles International and Stephen Clay Smith

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Readalong = require('react-readalong-component');

var DeliminatedParagraph = React.createClass({
	propTypes: {
		word: React.PropTypes.oneOf(["word", "sentence"])	
	},

  mixins: [PureRenderMixin],

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

					<Readalong lang="en-US" voiceName={this.state.voice} delimiter={this.state.delimiter}>
						{this.props.children}
					</Readalong>
				</div>
		);
	}
});

module.exports = DeliminatedParagraph;
