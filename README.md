React Readalong Component
=========================

A React component that uses the Speech Synthesis API to read text out loud by sentence or word while the user follows
along with their mouse or finger


## Demo & Examples

Live demo: [Github Pages](http://)

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

<dl>
  <dt>lang</dt><dd>*Any standard HTML language encoding code.* Used by the browser to select a default voice.</dd>
  <dt>delimiter</dt><dd>*Either "word" or "sentence."* The size of the spoken chunks.</dd>
  <dt>voiceName</dt><dd>*Name of any voice supported by the browser.* Overrides the default selected for language.</dd>
</dl>

```
var Readalong = require('react-readalong-component');

<Readalong lang="en" delimiter="sentence">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc turpis eros, interdum ut gravida ultrices, pellentesque
  quis metus. Fusce suscipit ullamcorper magna, eget consequat nulla pharetra at. Morbi luctus dapibus nulla, sit amet
  commodo purus lacinia nec. Duis in metus at est sagittis fermentum non dapibus ante. Nulla vitae sodales massa, ut
  ullamcorper odio. Praesent sollicitudin neque vel mauris elementum, tincidunt porta elit aliquet. Nullam tincidunt
  turpis a dolor condimentum maximus.
</Readalong>
```

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

