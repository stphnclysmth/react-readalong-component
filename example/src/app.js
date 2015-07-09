var React = require('react');
var Readalong = require('react-component-readalong');
var DeliminatedParagraph = require('./DeliminatedParagraph');

var Highlight = require('highlight.js');

var simple = <Readalong lang="en-US" delimiter="word">
	There once was an old woman who lived in a shoe. She was underwater on her mortgage. What would she do?
</Readalong>;

React.render(simple, document.getElementById('simple'));

var InnerElement = React.createClass({
	render: function() {
		return (
				<DeliminatedParagraph>
					<blockquote>
						<p>This sentence has five words. Here are five more words. Five-word sentences are fine. But several together 
						become monotonous. Listen to what is happening. The writing is getting boring. The sound of it drones. It’s 
						like a stuck record. The ear demands some variety. Now listen. I vary the sentence length, and I create 
						music. Music. The writing sings. It has a pleasant rhythm, a lilt, a harmony. I use short sentences. And I 
						use sentences of medium length. And sometimes, when I am certain the reader is rested, I will engage him 
						with a sentence of considerable length, a sentence that burns with energy and builds with all the impetus of
						a crescendo, the roll of the drums, the crash of the cymbals–sounds that say listen to this, it is 
						important.</p>
						
						<footer ignore><cite>Gary Provost</cite></footer>
					</blockquote>
				</DeliminatedParagraph>
		)
	}
});

React.render(<InnerElement />, document.getElementById('inner-element'));

var MultipleElements = React.createClass({
	render: function() {
		return (
			<DeliminatedParagraph>
				<p><span data-verse="1">In the beginning was the Word, and the Word was 
				with God, and the Word was God.</span> <span data-verse="2">The same was in 
				the beginning with God.</span> <span data-verse="3">All things were made 
				through him. Without him, nothing was made that has been made.</span> 
				<span data-verse="4">In him was life, and the life was the light of 
				men.</span> <span data-verse="5">The light shines in the darkness, and the 
				darkness hasn’t overcome it.</span></p> 
				
				<p><span data-verse="6">There came a man, 
				sent from God, whose name was John.</span> <span data-verse="7">The same came 
				as a witness, that he might testify about the light, that all might 
				believe through him.</span> <span data-verse="8">He was not the light, but was
				sent that he might testify about the light.</span> <span data-verse="9">The 
				true light that enlightens everyone was coming into the world.</span></p>
			</DeliminatedParagraph>
			)
	}
});

React.render(<MultipleElements />, document.getElementById('multiple-elements'));

Highlight.initHighlightingOnLoad();
