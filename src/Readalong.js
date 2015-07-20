/**

 The MIT License (MIT)

 Copyright (c) 2015 Talking Bibles International and Stephen Clay Smith

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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
var isValidElement = require('react/addons').isValidElement;
var Phrase = require('./Phrase');


/*************************
 Constants
 *************************/

var characterRanges = {
  latinLetters: '\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u017F\\u0100-\\u01FF\\u0180-\\u027F'
};

var regExp = {
  abbreviations: new RegExp('[^' + characterRanges.latinLetters + '](e\\.g\\.)|(i\\.e\\.)|(mr\\.)|(mrs\\.)|(ms\\.)|(dr\\.)|(prof\\.)|(esq\\.)|(sr\\.)|(jr\\.)[^' + characterRanges.latinLetters + ']', 'ig'),
  innerWordPeriod: new RegExp('[0-9' + characterRanges.latinLetters + ']\\.[0-9' + characterRanges.latinLetters + ']', 'ig')
};


/*************************
 Punctuation Escaping
 *************************/

/*
 Escape likely false-positives of sentence-final periods. Escaping is performed by wrapping a character's ASCII
 equivalent in double curly brackets, which is then reversed (deencodcoded) after delimiting.
 */
function encodePunctuation(text) {
  return text
    /* Escape the following Latin abbreviations and English titles: e.g., i.e., Mr., Mrs., Ms., Dr., Prof., Esq., Sr., and Jr. */
      .replace(regExp.abbreviations, function (match) {
        return match.replace(/\./g, '{{46}}');
      })
    /* Escape inner-word (non-space-delimited) periods. For example, the period inside 'Blast.js'. */
      .replace(regExp.innerWordPeriod, function (match) {
        return match.replace(/\./g, '{{46}}');
      });
}

/*
 Used to decode both the output of encodePunctuation() and punctuation that has been manually escaped by users.
 */
function decodePunctuation(text) {
  return text.replace(/{{(\d{1,3})}}/g, function (fullMatch, subMatch) {
    return String.fromCharCode(subMatch);
  });
}

/*************************
 Delimiter Creation
 *************************/

function getDelimiterRegex(delimiter) {
  switch (delimiter) {
    case 'word':
      /* Matches strings in between space characters. */
      /* Note: Matches will include any punctuation that's adjoined to the word, e.g. 'Hey!' will be a full match. */
      /* Note: Remember that, with Blast, every HTML element marks the start of a brand new string. Hence, 'in<b>si</b>de' matches as three separate words. */
      return /\s*(\S+)\s*/;

    case 'sentence':
      /* Matches phrases either ending in Latin alphabet punctuation or located at the end of the text. (Linebreaks are not considered punctuation.) */
      /* Note: If you don't want punctuation to demarcate a sentence match, replace the punctuation character with {{ASCII_CODE_FOR_DESIRED_PUNCTUATION}}. ASCII codes: .={{46}}, ?={{63}}, !={{33}} */
      return /(?=\S)((?=[.。]{2,})?[^!?]+?[.…!?。！？]+|(?=\s+$)|$(?=\s*[′’'”″“'「『』」)»]+)*)/;
      /* RegExp explanation (Tip: Use Regex101.com to play around with this expression and see which strings it matches):
       - Expanded view: /(?=\S) ( ([.]{2,})? [^!?]+? ([.…!?]+|(?=\s+$)|$) (\s*[′’'”″“')»]+)* )
       - (?=\S) --> Match must contain a non-space character.
       - ([.]{2,})? --> Match may begin with a group of periods.
       - [^!?]+? --> Grab everything that isn't an unequivocally-terminating punctuation character, but stop at the following condition...
       - ([.…!?]+|(?=\s+$)|$) --> Match the last occurrence of sentence-final punctuation or the end of the text (optionally with left-side trailing spaces).
       - (\s*[′’'”″“')»]+)* --> After the final punctuation, match any and all pairs of (optionally space-delimited) quotes and parentheses.
       */

    case 'element':
      /* Matches text between HTML tags. */
      /* Note: Wrapping always occurs inside of elements, i.e. <b><span class='blast'>Bolded text here</span></b>. */
      return /(?=\S)([\S\s]*\S)/;
    default:
      break;
  }
}


/*************************
 Speech Synthesis
 *************************/

function getVoiceForName(name) {
  var voices = window.speechSynthesis.getVoices();

  var namedVoice = voices.filter(function (voice) {
      return voice.name === name;
    })[0];

  if (typeof namedVoice === 'object') {
    return namedVoice;
  }
}

function getVoiceForLanguage(lang, preferLocal) {
  if (typeof preferLocal !== 'boolean') {
    preferLocal = true;
  }

  var voices = window.speechSynthesis.getVoices();

  var languageVoices = voices.filter(function (voice) {
    return voice.lang === lang;
  });

  if (preferLocal) {
    var localVoices = languageVoices.filter(function (voice) {
      return voice.localService === true;
    });

    if (typeof localVoices[0] === 'object') {
      return localVoices[0];
    }
  }

  if (typeof languageVoices[0] === 'object') {
    return languageVoices[0];
  }
}

function getVoice(name, lang) {
  var namedVoice = getVoiceForName(name);
  if (typeof namedVoice === 'object') {
    return namedVoice;
  }

  var languageVoice = getVoiceForLanguage(lang, false);
  if (typeof languageVoice === 'object') {
    return languageVoice;
  }

  var voices = window.speechSynthesis.getVoices();
  return voices[0];
}


/*************************
 Component
 *************************/

var Readalong = React.createClass({

  /*
   * Component setup
   */

  displayName: 'Readalong',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    delimiter: React.PropTypes.oneOf(['word', 'sentence', 'element']).isRequired,
    lang: React.PropTypes.string.isRequired,
    voiceName: React.PropTypes.string
  },

  mixins: [PureRenderMixin],


  /*
   * Variables
   */

  _voice: null,
  _delimiterRegex: null,


  /*
   * Render
   */

  _wrapChildren: function (children) {
    return React.Children.map(children, this._wrapChild);
  },

  _wrapChild: function (child) {
    if (isValidElement(child)) {
      if (child.props.silent) {
        return child;
      }

      return React.cloneElement(child, {}, this._wrapChildren(child.props.children));
    }

    var phrases = [];

    if (this.props.delimiter === 'sentence') {
      child = encodePunctuation(child);
    }

    var matches = child.split(this._delimiterRegex);

    for (var i = 0; i < matches.length; i++) {
      var matchText = matches[i];

      if (this.props.delimiter === 'sentence') {
        matchText = decodePunctuation(matchText);
      }

      if (matchText.trim() === '') {
        phrases.push(' ');
        continue;
      }

      phrases.push(
        React.createElement(Phrase, {
          ref: 'phrase' + i,
          voice: this._voice,
          lang: this.props.lang
        }, matchText)
      );
    }

    return phrases;
  },

  render: function() {
    // Enable server-side rendering
    if (typeof window === 'object') {
      this._voice = getVoice(this.props.voiceName, this.props.lang);
    }

    this._delimiterRegex = getDelimiterRegex(this.props.delimiter);

    return React.createElement('div', {
          className: 'readalong',
          ref: 'readalong'},
        this._wrapChildren(this.props.children)
    );
  }

});

module.exports = Readalong;

