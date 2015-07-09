var React = require('react');
var isValidElement = require('react/addons').isValidElement;


/*************************
 Constants
 *************************/

var characterRanges = {
	//latinPunctuation: "–—′’'“″„\"(«.…¡¿′’'”″“\")».…!?",
	//chinesePunctuation: "。，！？；：（）【】［］「『』」",
	latinLetters: "\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u017F\\u0100-\\u01FF\\u0180-\\u027F"
};

var regExp = {
	abbreviations: new RegExp("[^" + characterRanges.latinLetters + "](e\\.g\\.)|(i\\.e\\.)|(mr\\.)|(mrs\\.)|(ms\\.)|(dr\\.)|(prof\\.)|(esq\\.)|(sr\\.)|(jr\\.)[^" + characterRanges.latinLetters + "]", "ig"),
	innerWordPeriod: new RegExp("[" + characterRanges.latinLetters + "]\.[" + characterRanges.latinLetters + "]", "ig")
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
				return match.replace(/\./g, "{{46}}");
			})
		/* Escape inner-word (non-space-delimited) periods. For example, the period inside "Blast.js". */
			.replace(regExp.innerWordPeriod, function (match) {
				return match.replace(/\./g, "{{46}}");
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
		case "word":
			/* Matches strings in between space characters. */
			/* Note: Matches will include any punctuation that's adjoined to the word, e.g. "Hey!" will be a full match. */
			/* Note: Remember that, with Blast, every HTML element marks the start of a brand new string. Hence, "in<b>si</b>de" matches as three separate words. */
			return /\s*(\S+)\s*/;
			break;

		case "sentence":
			/* Matches phrases either ending in Latin alphabet punctuation or located at the end of the text. (Linebreaks are not considered punctuation.) */
			/* Note: If you don't want punctuation to demarcate a sentence match, replace the punctuation character with {{ASCII_CODE_FOR_DESIRED_PUNCTUATION}}. ASCII codes: .={{46}}, ?={{63}}, !={{33}} */
			return /(?=\S)((?=[.。]{2,})?[^!?]+?[.…!?。！？]+|(?=\s+$)|$(?=\s*[′’'”″“"「『』」)»]+)*)/;
			/* RegExp explanation (Tip: Use Regex101.com to play around with this expression and see which strings it matches): 
			 - Expanded view: /(?=\S) ( ([.]{2,})? [^!?]+? ([.…!?]+|(?=\s+$)|$) (\s*[′’'”″“")»]+)* )
			 - (?=\S) --> Match must contain a non-space character.
			 - ([.]{2,})? --> Match may begin with a group of periods.
			 - [^!?]+? --> Grab everything that isn't an unequivocally-terminating punctuation character, but stop at the following condition...
			 - ([.…!?]+|(?=\s+$)|$) --> Match the last occurrence of sentence-final punctuation or the end of the text (optionally with left-side trailing spaces).
			 - (\s*[′’'”″“")»]+)* --> After the final punctuation, match any and all pairs of (optionally space-delimited) quotes and parentheses.
			 */
			break;

		case "element":
			/* Matches text between HTML tags. */
			/* Note: Wrapping always occurs inside of elements, i.e. <b><span class="blast">Bolded text here</span></b>. */
			return /(?=\S)([\S\s]*\S)/;
	}
}


/*************************
 Speech Synthesis
 *************************/

function getVoiceForName(name) {
	var voices = window.speechSynthesis.getVoices();
	return voices.filter(function (voice) {
		return voice.name === name;
	})[0] || voices[0];
}

function chunkString(str, length) {
	return str.match(new RegExp('[\\s\\S]{1,' + length + '}(?:\\s|$)', 'g'));
}


/*************************
 Components
 *************************/
    
var Phrase = React.createClass({
  getInitialState: function() {
    return {
      activeClass: "" 
    }
  },
  
  render: function () {
    return <span className={'readalong-phrase ' + this.state.activeClass}
                 onMouseOver={this.props.onMouseOver} 
                 onMouseOut={this.props.onMouseOut} 
                 ariaHidden="true">
             {this.props.children}
           </span>;
  }
});
	
var Readalong = React.createClass({
	propTypes: {
		lang: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.oneOf(['word', 'sentence', 'element']).isRequired,
		voice: React.PropTypes.string
	},

	phraseIndex: 0,
	  
	mouseOverChild: {},

  mouseOverChildTimeout: {},
  
  speakingChild: {},
		
	getInitialState: function () {		
		return {
			voice: getVoiceForName(this.props.voice),
			delimiter: this.props.delimiter,
			delimiterRegex: getDelimiterRegex(this.props.delimiter)
		}
	},
	
	componentWillReceiveProps: function (newProps) {
		this.phraseIndex = 0;

		this.setState({
			voice: getVoiceForName(newProps.voice),
			delimiter: newProps.delimiter,
			delimiterRegex: getDelimiterRegex(newProps.delimiter)
		});
	},
	
	onMouseOver: function(ref) {    
    window.clearTimeout(this.mouseOverChildTimeout);

    var child = this.refs[ref];

    if (this.mouseOverChild === child) return;
    this.mouseOverChild = child;

    window.speechSynthesis.cancel();

    this.speechWillBegin(child);

    var msg = new SpeechSynthesisUtterance();
		msg.text = child.getDOMNode().textContent;
		msg.lang = this.props.lang;
		msg.voice = this.state.voice;
    
    msg.onerror = function() { this.speechDidEnd(child); }.bind(this);
		msg.onend = function() { this.speechDidEnd(child); }.bind(this);
    
		window.speechSynthesis.speak(msg);
	},

  onMouseOut: function() {
    if (window.speechSynthesis.speaking) {
      this.mouseOverChildTimeout = window.setTimeout(function() {
        this.mouseOverChild = null;
      }.bind(this), 500);
    } else {
      this.mouseOverChild = null;
    }
  },
  
  speechWillBegin: function(child) {
    this.speakingChild = child;
    
    child.setState({
      activeClass: "readalong-active"
    });
  },
  
  speechDidEnd: function(child) {
    if (window.speechSynthesis.speaking) {
      if (this.speakingChild === child) return;
    } else {
      this.speakingChild = null;      
    }

    child.setState({
      activeClass: ""
    });
  },

	wrapChildren: function (children) {
		return React.Children.map(children, this.wrapChild);
	},
	
	wrapChild: function (child) {
		if (isValidElement(child)) {			
			if (child.props.silent ) {
				return child;
			}
			
			return React.cloneElement(child, {}, this.wrapChildren(child.props.children));
		}

		var phrases = [];
    		
		if (this.state.delimiter === "sentence") {
			child = encodePunctuation(child);
		}
						
		var matches = child.split(this.state.delimiterRegex);
		
		for(var i = 0; i < matches.length; i++) {
			var matchText = matches[i];

			if (matchText === undefined) {
				continue;
			}

			if (this.state.delimiter === "sentence") {
				matchText = decodePunctuation(matchText);
			}

			if (matchText.trim() === "") {
				phrases.push(" ");
				this.phraseIndex++;
			} else {
				var matchPhrases = chunkString(matchText, 180);
				
				for (matchPhrase of matchPhrases) {
          var ref = 'phrase' + this.phraseIndex;
					phrases.push(
						<Phrase key={this.phraseIndex}
                    ref={ref}
							      onMouseOver={this.onMouseOver.bind(this, ref)} 
							      onMouseOut={this.onMouseOut.bind(this, ref)}>
							{matchPhrase}
						</Phrase>
					);
					this.phraseIndex++;
				}	
			}
		}
			
		return phrases;
	},
	
	render: function() {
		var phrases = this.wrapChildren(this.props.children);
		
		return <div className="readalong">{phrases}</div>;
	}

});

module.exports = Readalong;

