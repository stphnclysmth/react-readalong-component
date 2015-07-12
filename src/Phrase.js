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


/*************************
 React custom attrs shim
 *************************/

var DOMProperty = require('react/lib/ReactInjection').DOMProperty;
DOMProperty.injectDOMPropertyConfig({
  Properties: {
    'touchAction': DOMProperty.MUST_USE_ATTRIBUTE
  }
});

/*************************
 Constants
 *************************/

var timeoutDelay = 500;
var maxPhraseLength = 180;


/*************************
 Utilities
 *************************/

function chunkString(str, length) {
  return str.match(new RegExp('[\\s\\S]{1,' + length + '}(?:\\s|$)', 'g'));
}


/*************************
 Component
 *************************/

var Phrase = React.createClass({

  /*
   * Component setup
   */

  displayName: 'Phrase',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    lang: React.PropTypes.string.isRequired,
    voice: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      activeClass: ''
    };
  },

  componentDidMount: function() {
    var el = this.getDOMNode();

    this.getDOMNode().setAttribute('touch-action', 'none');

    el.addEventListener('pointerenter', this._pointerEnter);
    el.addEventListener('pointerleave', this._pointerLeave);
  },


  /*
   * Variables
   */

  _leaveTimeout: null,


  /*
   * User interface
   */

  _activatePhrase: function() {
    this.setState({
      activeClass: 'readalong-active'
    });
  },

  _deactivatePhrase: function() {
    this.setState({
      activeClass: ''
    });
  },


  /*
   * Pointer Events
   */

  _pointerEnter: function() {
    // Do not speak again if this is a reentry
    if (typeof this._leaveTimeout !== 'number') {
      this._speak();
    } else {
      this._stopWaitingForReentry();
    }

    this._activatePhrase();
  },

  _pointerLeave: function() {
    if (window.speechSynthesis.speaking) {
      this._leaveTimeout = window.setTimeout(this._stopWaitingForReentry, timeoutDelay);

      return;
    }

    this._deactivatePhrase();
  },

  _stopWaitingForReentry: function() {
    delete this._leaveTimeout;
  },


  /*
   * Speech Synthesis
   */

  _speak: function() {
    window.speechSynthesis.cancel();

    var phrases = chunkString(this.props.children, maxPhraseLength);

    var utterances = phrases.map(function(phrase) {
      var msg = new SpeechSynthesisUtterance();
      msg.text = phrase;
      msg.lang = this.props.lang;

      if (typeof this.props.voice === 'object') {
        msg.voice = this.props.voice;
      }

      msg.addEventListener('end', this._speechDidEnd);
      msg.addEventListener('error', this._speechDidError);

      return msg;
    }, this);

    utterances.forEach(function (utterance) {
      window.speechSynthesis.speak(utterance);
    });
  },


  /*
   * Speech Synthesis callbacks
   */

  _speechDidEnd: function() {
    this._stopWaitingForReentry();
    this._deactivatePhrase();
  },

  _speechDidError: function(error) {
    console.error(error);

    this._speechDidEnd();
  },


  /*
   * Render
   */

  render: function () {
    return React.createElement('span', {
          ariaHidden: 'true',
          touchAction: 'none',
          className: 'readalong-phrase ' + this.state.activeClass
        },
        this.props.children
    );
  }
});

module.exports = Phrase;
