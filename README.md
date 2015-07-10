React Readalong Component
=========================

A React component that uses the Speech Synthesis API to read text out loud by sentence or word while the user follows
along with their mouse or finger


## Demo & Examples

Live demo: [Github Pages](http://talkingbibles.github.io/react-readalong-component/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use Readalong is to install it from NPM and include it in your own React build process (using
[Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-component-readalong.js` in your page. If you use this,
make sure you have already included React, and it is available as a global variable.

```
npm install react-component-readalong --save
```

## Usage

The component provides a single element, `Readalong`, that takes three properties and some text content. The properties
of `lang` and `delimiter` can be provided as attributes, while `voiceName` should be passed after the browser registers
the available Speech Synthesis voices. The browser will use its default voice until a valid, different voice is passed.
The component will attempt to choose a default voice based on the passed `lang` property, but this is hit-or-miss.

<dl>
<dt>lang</dt><dd><em>Any standard HTML language encoding code.</i> Used by the browser to select a default voice.</dd>
<dt>delimiter</dt><dd><em>Either "word" or "sentence."</i> The size of the spoken chunks.</dd>
<dt>voiceName</dt><dd><em>Name of any voice supported by the browser.</i> Overrides the default selected for language.</dd>
</dl>

```javascript
var Readalong = require('react-readalong-component');

<Readalong lang="en" delimiter="sentence">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc turpis eros, interdum ut gravida ultrices, pellentesque
  quis metus. Fusce suscipit ullamcorper magna, eget consequat nulla pharetra at. Morbi luctus dapibus nulla, sit amet
  commodo purus lacinia nec. Duis in metus at est sagittis fermentum non dapibus ante. Nulla vitae sodales massa, ut
  ullamcorper odio. Praesent sollicitudin neque vel mauris elementum, tincidunt porta elit aliquet. Nullam tincidunt
  turpis a dolor condimentum maximus.
</Readalong>
```

The output of the component receives three classes for use with styling. The outer wrapper has the class,
`readalong`. Every readable phrase is wrapped in a span with the `readalong-phrase` class.
While a phrase is being spoken, the corresponding span also receives a `readalong-active` class. This
can be used, as in the examples below, to keep the phrase highlighted after the user moves off or releases her
finger.

It is advisable to make the font size as large as possible for the contents of a Readalong element. This is
especially true if the delimiter is set to `word`.


## Compatibility

As of July 2015, The Speech Synthesis API is still [an unofficial proposal](http://caniuse.com/#feat=speech-synthesis).
As such, right out of the box this component will only work on about half of all browsers. Those include recent versions
of Chrome, Opera, and Safari. Ostensibly, iOS Safari is supported, but Speech Synthesis seems to work in that browser
only sporadically. All other browsers will need a polyfill.

This component intentionally does not include a polyfill. There are several polyfill options, and the one you choose
will depend on the needs of your project. The component also intentionally does check whether the Speech Synthesis
API is available. Readalong assumes that both `window.speechSynthesis` and the `SpeechSynthesisUtterance` object are
available, and that they are up-to-date with the unofficial proposal.


## Todo

- Add more information to Github page
- Add better documentation and usage information
- Add tests


## License

The constants, regular expressions, and punctuation encoding used in this project were originally lifted from Blast.js,
built by Julian Shapiro. These have been modified to fit the particular requirements of this project, including the
addition of the Chinese punctuation.

Blast.js. MIT License. Copyright 2014 Julian Shapiro
MIT License. Copyright 2015 Talking Bibles International and Stephen Clay Smith

