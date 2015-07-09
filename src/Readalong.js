var React = require('react');
var isValidElement = require('react/addons').isValidElement;
var Phrase = require('./Phrase');

/*************************
 Constants
 *************************/

var characterRanges = {
	latinPunctuation: "–—′’'“″„\"(«.…¡¿′’'”″“\")».…!?",
	latinLetters: "\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u017F\\u0100-\\u01FF\\u0180-\\u027F"
};

var regExp = {
	abbreviations: new RegExp("[^" + characterRanges.latinLetters + "](e\\.g\\.)|(i\\.e\\.)|(mr\\.)|(mrs\\.)|(ms\\.)|(dr\\.)|(prof\\.)|(esq\\.)|(sr\\.)|(jr\\.)[^" + characterRanges.latinLetters + "]", "ig"),
	innerWordPeriod: new RegExp("[" + characterRanges.latinLetters + "]\.[" + characterRanges.latinLetters + "]", "ig"),
	onlyContainsPunctuation: new RegExp("[^" + characterRanges.latinPunctuation + "]"),
	adjoinedPunctuation: new RegExp("^[" + characterRanges.latinPunctuation + "]+|[" + characterRanges.latinPunctuation + "]+$", "g"),
	skippedElements: /(script|style|select|textarea)/i
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
			return /(?=\S)((?=[.]{2,})?[^!?]+?[.…!?]+|(?=\s+$)|$(?=\s*[′’'”″“")»]+)*)/;
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

function getVoiceForLanguage(language) {
	return window.speechSynthesis.getVoices().filter(function (voice) {
		return voice.lang === language;
	})[0];
}

function getVoiceForName(name) {
	return window.speechSynthesis.getVoices().filter(function (voice) {
		return voice.name === name;
	})[0];
}

/*************************
 Component
 *************************/
var SpeakableParagraph = React.createClass({
	propTypes: {
		lang: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.oneOf(['word', 'sentence', 'element']).isRequired,
		voice: React.PropTypes.string
	},

	phraseIndex: 0,
	
	currentTarget: {},
		
	getInitialState: function () {	
		return {
			voice: getVoiceForName(this.props.voice) || getVoiceForLanguage(this.props.lang),
			delimiter: this.props.delimiter,
			delimiterRegex: getDelimiterRegex(this.props.delimiter)
		}
	},
	
	componentWillReceiveProps: function (newProps) {		
		this.setState({
			voice: getVoiceForName(newProps.voice) || getVoiceForLanguage(this.props.lang),
			delimiter: newProps.delimiter,
			delimiterRegex: getDelimiterRegex(newProps.delimiter)
		});
	},
	
	beginSpeaking: function(event) {
		if (this.currentTarget === event.target) return;

		this.currentTarget = event.target;

		window.speechSynthesis.cancel();

		var msg = new SpeechSynthesisUtterance();
		msg.text = event.target.textContent;
		msg.lang = this.props.lang;
		msg.voice = this.state.voice;
		
		window.speechSynthesis.speak(msg);
	},
	
	releaseSpeaker: function () {
		this.currentTarget = null;
	},

	wrapChildren: function (children) {
		return React.Children.map(children, this.wrapChild);
	},
	
	wrapChild: function (child) {
		if (isValidElement(child)) {			
			if (child.props.ignore) {
				return child;
			}
			
			return React.cloneElement(child, {}, this.wrapChildren(child.props.children));
		}

		var phrases = [];
    		
		if (this.props.delimiter === "sentence") {
			child = encodePunctuation(child);
		}
						
		var matches = child.split(this.state.delimiterRegex);
		
		for(var i = 0; i < matches.length; i++) {
			var matchText = matches[i];

			if (matchText === undefined) {
				continue;
			}

			if (this.props.delimiter === "sentence") {
				matchText = decodePunctuation(matchText);
			}

			if (matchText === "") {
				this.phraseIndex++;
				phrases.push(" ");
			} else {
				phrases.push(<Phrase key={this.phraseIndex} speak={this.beginSpeaking} release={this.releaseSpeaker}>{matchText}</Phrase>);
			}


			this.phraseIndex++;
		}
			
		return phrases;
	},
	
	render: function () {
		var speakablePhrases = this.wrapChildren(this.props.children);
		
		return <div>
			<div className="speakable-paragraph">
				{speakablePhrases}
			</div>
		</div>;
	}

});

module.exports = SpeakableParagraph;

