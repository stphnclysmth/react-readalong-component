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
var DelimitedParagraph = require('./DelimitedParagraph');

var Highlight = require('highlight.js');

React.render((
		<Readalong lang="en-US" delimiter="word">
			There once was an old woman who lived in a shoe. She was underwater on her mortgage. What would she do?
		</Readalong>
), document.getElementById('simple'));


React.render((
    <DelimitedParagraph delimiter="sentence">
      <blockquote>
        <p>This sentence has five words. Here are 5.0 more words. Five-word sentences are fine. But several together
          become monotonous. Listen to what is happening. The writing is getting boring. The sound of it drones. It’s
          like a stuck record. The ear demands some variety. Now listen. I vary the sentence length, and I create
          music. Music. The writing sings. It has a pleasant rhythm, a lilt, a harmony. I use short sentences. And I
          use sentences of medium length. And sometimes, when I am certain the reader is rested, I will engage him
          with a sentence of considerable length, a sentence that burns with energy and builds with all the impetus of
          a crescendo, the roll of the drums, the crash of the cymbals–sounds that say listen to this, it is
          important.</p>

        <footer silent><cite>Gary Provost</cite></footer>
      </blockquote>
    </DelimitedParagraph>
), document.getElementById('inner-element'));

React.render((
    <DelimitedParagraph>
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

      <footer>— <cite>John 1:1–9</cite></footer>
    </DelimitedParagraph>
), document.getElementById('multiple-elements'));

React.render((
	<Readalong lang="es" delimiter="sentence">
		En un lugar de la Mancha, de cuyo nombre no quiero acordarme,
		no ha mucho tiempo que vivía un hidalgo de los de lanza en
		astillero, adarga antigua, rocín flaco y galgo corredor. Una
		olla de algo más vaca que carnero, salpicón las más noches,
		duelos y quebrantos los sábados, lentejas los viernes, algún
		palomino de añadidura los domingos, consumían las tres partes
		de su hacienda. El resto della concluían sayo de velarte,
		calzas de velludo para las fiestas con sus pantuflos de lo
		mismo, los días de entre semana se honraba con su vellori de
		lo más fino. Tenía en su casa una ama que pasaba de los
		cuarenta, y una sobrina que no llegaba a los veinte, y un mozo
		de campo y plaza, que así ensillaba el rocín como tomaba la
		podadera. Frisaba la edad de nuestro hidalgo con los cincuenta
		años, era de complexión recia, seco de carnes, enjuto de
		rostro; gran madrugador y amigo de la caza. Quieren decir que
		tenía el sobrenombre de Quijada o Quesada (que en esto hay
		alguna diferencia en los autores que deste caso escriben),
		aunque por conjeturas verosímiles se deja entender que se
		llama Quijana; pero esto importa poco a nuestro cuento; basta
		que en la narración dél no se salga un punto de la verdad.
	</Readalong>
), document.getElementById('spanish-language'));

React.render((
	<Readalong lang="zh" delimiter="sentence">
		<p>
			<i silent>1</i>太 初 有 道 ， 道 与 神 同 在 ， 道 就 是 神 。
			<i silent>2</i>这 道 太 初 与 神 同 在 。 <i silent>3</i>万 物 是 
			藉 着 他 造 的 ； 凡 被 造 的 ， 没 有 一 样 不 是 藉 着 他 造 的 。 
			<i silent>4</i>生 命 在 他 里 头 ， 这 生 命 就 是 人 的 光 。 
			<i silent>5</i>光 照 在 黑 暗 里 ， 黑 暗 却 不 接 受 光 。 
			<i silent>6</i>有 一 个 人 ， 是 从 神 那 里 差 来 的 ， 名 叫 约 翰 。 
			<i silent>7</i>这 人 来 ， 为 要 作 见 证 ， 就 是 为 光 作 见 证 ， 
			叫 众 人 因 他 可 以 信 。 <i silent>8</i>他 不 是 那 光 ， 乃 是 要 
			为 光 作 见 证 。 <i silent>9</i>那 光 是 真 光 ， 照 亮 一 切 生 
      在 世 上 的 人 。
		</p>
	</Readalong>
), document.getElementById('chinese-language'));

Highlight.initHighlightingOnLoad();
