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

'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var LinkedStateMixin = require('react/addons').addons.LinkedStateMixin;
var Readalong = require('react-readalong-component');

var DeliminatedParagraph = React.createClass({
  displayName: 'DeliminatedParagraph',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    delimiter: React.PropTypes.oneOf(['word', 'sentence']).isRequired,
    lang: React.PropTypes.string.isRequired
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState: function () {
    return {
      delimiter: this.props.delimiter,
      voices: [],
      voiceName: null
    };
  },

  componentWillMount: function () {
    this._getVoices(0);
  },

  _getVoices: function(attempt) {
    var voices = window.speechSynthesis.getVoices();

    if (voices && voices.length > 0) {
      voices.unshift('');

      this.setState({
        voices: voices
      });

      return;
    }

    if (attempt <= 30) {
      setTimeout(this._getVoices.bind(this, ++attempt), 500);

      return;
    }

    console.error(this.displayName + ': Could not load Speech Synthesis voices before timeout.');
  },

  render: function () {
    var voiceOptions = this.state.voices.map(function (voice, index) {
      if (typeof voice === 'object') {
        return <option key={voice.name} value={voice.name}>{voice.name}</option>;
      }

      return <option key={index}></option>
    });

    var disabled = (voiceOptions.length > 0) ? '' : 'disabled';

    return (
        <div>
          <div className='well well-sm'>
            <form className='form'>
              <div className='row'>
                <div className='form-group col-lg-4'>
                  <label className='control-label'>Delimiter</label>
                  <select className='form-control' valueLink={this.linkState('delimiter')}>
                    <option value='sentence'>Sentence</option>
                    <option value='word'>Word</option>
                  </select>
                </div>

                <div className='form-group col-lg-4'>
                  <label className='control-label'>Voice</label>
                  <select className='form-control' disabled={disabled} valueLink={this.linkState('voiceName')}>
                    {voiceOptions}
                  </select>
                </div>

                <div className='col-lg-4'>
                  <span className='help-block'>The list of voices is populated by the voices available to your browser's SpeechSynthesis API.</span>
                </div>
              </div>
            </form>
          </div>

          <Readalong delimiter={this.state.delimiter} lang={this.props.lang} voiceName={this.state.voiceName}>
            {this.props.children}
          </Readalong>
        </div>
    );
  }
});

module.exports = DeliminatedParagraph;
