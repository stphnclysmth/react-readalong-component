#  <img src="https://avatars3.githubusercontent.com/u/12140183" width="26" height="26"> React Readalong Component

[![MIT License](https://img.shields.io/github/license/TalkingBibles/react-readalong-component.svg)](LICENSE)
[![NPM](https://img.shields.io/npm/v/react-readalong-component.svg)](https://www.npmjs.com/package/react-readalong-component)
[![Bower](https://img.shields.io/bower/v/react-readalong-component.svg)](bower.json)
[![Dependencies](https://david-dm.org/TalkingBibles/react-readalong-component.svg)](https://david-dm.org/TalkingBibles/react-readalong-component)


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

You can also use the standalone build by including `dist/react-readalong-component.js` in your page. If you use this,
make sure you have already included React, and it is available as a global variable.

```
npm install react-readalong-component --save
```

## Usage

The component provides a single element, `Readalong`, that takes three properties and some text content. The properties
of `lang` and `delimiter` can be provided as attributes, while `voiceName` should be passed after the browser registers
the available Speech Synthesis voices. The browser will use its default voice until a valid, different voice is passed.
The component will attempt to choose a default voice based on the passed `lang` property, but this is hit-or-miss.

<dl>
<dt>lang</dt><dd><em>Any standard HTML language encoding code.</em> Used by the browser to select a default voice.</dd>
<dt>delimiter</dt><dd><em>Either "word" or "sentence."</em> The size of the spoken chunks.</dd>
<dt>voiceName</dt><dd><em>Name of any voice supported by the browser.</em> Overrides the default selected for language.</dd>
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

This component depends on two experimental, draft APIs: [Pointer Events](http://caniuse.com/#feat=pointer)
and [Speech Synthesis](http://caniuse.com/#feat=speech-synthesis).

**As of July 12, 2015, the Web Speech API is still an unofficial proposal.** As such, right out
of the box this component will only work in about half of all browsers. Those include recent versions of Chrome,
Opera, and Safari. Ostensibly, iOS Safari is supported, but Speech Synthesis seems to work in that browser only
sporadically. All other browsers will need a polyfill. There is no polyfill for Speech Synthesis currently
installed on this demonstration page.

Again, as of the time of this commit, the Pointer Events API is very poorly supported across all browsers. Only
IE and very late version Firefox have implemented it. **There's no getting away without a polyfill for Pointer
Events.** They power the cursor/finger recognition. Fortunately, Google/jQuery have put together a fantastic
polyfill called [PEP](https://github.com/jquery/PEP), which is providing cross-browser capability for
this page. It does not require jQuery as a dependency.

This component intentionally does not include polyfills. There are many polyfill options, and the one you choose
will depend on the needs of your project. The component also intentionally does check whether the Speech Synthesis
API is available. Readalong assumes that both `window.speechSynthesis` and the `SpeechSynthesisUtterance` object are
available, and that they are up-to-date with the unofficial proposal.


## License

This component was structured on top of [react-component-starter](https://github.com/JedWatson/react-component-starter)
project by [Jed Watson](https://github.com/JedWatson).

The constants, regular expressions, and punctuation encoding used in this project were originally lifted from
[Blast.js](https://github.com/julianshapiro/blast), built by [Julian Shapiro](https://github.com/julianshapiro). These have
been modified to fit the particular requirements of this project, including the addition of the Chinese punctuation into the
regular expression used to recognize sentence boundaries.

react-component-starter. MIT License. Copyright 2014 Jed Watson.
Blast.js. MIT License. Copyright 2014 Julian Shapiro.
react-readalong-component. MIT License. Copyright 2015 Talking Bibles International and Stephen Clay Smith.

