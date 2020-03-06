---
author: k-l-lambda
coauthor: k-l-lambda
email: k-l-lambda@gmail.com
title: A proposal for content based MIDI files indexing and retrieving on piano
mathjax: true
tags:
- music
- midi
---

<figure>
	{% img figure /images/gfind-crystal.webp 400 '"" "smart piano"' %}
	<figcaption>A smart piano.</figcaption>
</figure>

## Motivation

Imagine you have a smart piano at home, which connected with a huge music staff library.
Once, you wanna play some muic opus on a whim, and it's so bothering to retrieve music staff in either category menus or a long favorite list,
that you just play by memory directly.
But the piano is so smart, just a few seconds later, it understands what you are playing, and displays the staff automatically.

Another case. You see a nice piano when hanging out downtown, and you are just in a mood to play a music and show your talent to passers.
When you sit and play, surprisingly, the piano displays out the music information for what you are playing.
And when you finish, it says, well done! Your performence beat 95% players on this opus.

Imaginary scenes above are comming true. Now let's talk about some ideas for implementing such a technique.

<!-- more -->


## Related work

Early in 1999, Cavalcanti et al. proposed a MIDI indexing system scheme[^1].
The system converts a melody notes sequence into a new sequence of 7 dimensional[^2] wavelet transformed vectors,
then match a piece of query melody notes by measuring Euclidean distance between feature vectors.
This scheme has several advantages:

* Local matching. Query melody can be a short fragment, whose length is just enough to distinguish source music from other similar ones.

* Key insensitive, i.e. the query melody can be on a different key with source melody.
Because wavelet transformed vectors only extract relative pitch information.

* Pitch error tolerant. Euclidean distance magnitude of feature vectors reflect the similarity of melody fragments.
If query melody have slight off-pitch from correct source melody, distance loss will keep tiny.

However, on our particular purpose of piano playing, there are some issues in this scheme:

* Wavelet transform is performing on a single melody line, while a piano music opus usually has rich harmony texture,
and splitting melody voice from the whole music texture is troublesome:
some polyphony music piece has no definite main melody line,
some MIDI files made from piano staff splits tracks by left/right hand, not voices.

* Furthermore, harmony voices are meaningful.
Most of popular songs have serval versions sharing the same melody, but with different harmony arrangement.
Query notes in harmony voice can be just the fingerprint of user searching goal.

* The notes sequence processing is sensitive with omit/extra note.
Though a deviated note can be tolerant by this scheme, but omit/extra ones are not.
Because note count change will break fragment splitting, especially when interval between 2 errors is less than fragment length 2<sup>k</sup>.

We propose a new approach to deal with MIDI retrieving with input interface of piano playing, which partitions this task into 2 phases:
pitch frequency indexing (rough phase) and music fuzzy matching (fine phase). The fine phase is also a robust score following algorithm,
which play a key role in the smart piano user interactive system, also a pending patent.
I hope there is another opportunity to talk details of the score following method. In this article we focus on the rough phase.


## How it works

A score following program is an agent to guess where place in a specific music score, the user is playing at right now.
As hint by the word *guess* (or *fuzzy*), the program will output a confidence value to tell how confident it believes its result.

Now, what if we use a wrong score? Obviously, any possible guessing won't be with a high confidence.
Maybe some fragment in user playing sequence is similar with the (wrongly) specific score someplace, but the matching must be highly fragmentized.
If we measure the typical continuous following length with a proper confidence threshold, a normal score following will completely beat a wrong score following.

So we have a touchstone to check how well a music score match what user are playing, and if we run this program on all scores we have simultaneously,
we are able to pick the best matching score by results sorting. Certainly, it's not practicable&#x1f604;.
However, if we sieve off those obvious impossible candidates, and a small left magnitude can be affordable.
So this is the rough phase, the design aim is fast and concurrency, not precise. And for possible candidates, rather let it go than kill.

To construct a MIDI indexing, available properties of music piece include pitch, time and velocity (strength).
Velocity/strength is out firstly because its highly mutable.
Time property is valuable to identify a score, but the time data to record human playing is usually in millisecond or microsecond,
which is very continuous (not as discrete as pitch on keyboard instrument), and difficult to extract identify information.
However, the time information utilizing is an open problem to exploit in future.

Inevitably, pitch is the last option.
To fast index scores, we convert the pitch characteristic of a whole candidate score (or user playing) notes into serval integer numbers.
The filter operation, pass or fail judgement is done by binary number calculation, which is fast and constant with single score length
(O(n) with candidate score count, but can be optimized by concurrency).

The pitch characteristic is accumulatable with notes, and a music piece with more notes has stronger characteristic,
i.e. as user keep playing, more and more candidate scores will be sieved off.
Once candidate score count is lower than affordable line, we will run the fine phase.

We define an efficiency benchmark:

$$ \textrm{filter stregth} := 1 - \frac{\textrm{left candidate count}}{\textrm{total candidate count}} $$

As long as we didn't miss the potential goal score, we will enhance filter strength as well as we can.


## Pitch frequency indexing

<div class="vue-component midi-pitches-counter" data-midi-url="/midi/Minuets_in_G_major.mid"></div>


<div class="vue-component chart" data-type="Line" data-source="/charts/score-pitch-frequency-dist.json"></div>


<div class="vue-component chart" data-source="/charts/pitch-histogram-minuet-in-Gmajor.json"></div>


<div class="vue-component chart" data-source="/charts/pitch-mask-minuet-in-Gmajor.json"></div>


<datalist id="midi-list">
	<option value="/midi/Turkish_Rondo.mid">
	<option value="/midi/Minuets_in_G_major.mid">
	<option value="/midi/Fur_Elise.mid">
	<option value="/midi/Chopin_Nocturne_in_E_flat_major.mid">
	<option value="/midi/Ballade_pour_Adeline.mid">
	<option value="/midi/Wings_of_Silence.mid">
</datalist>
<div class="vue-component midi-pitches-mask" data-source-list="#midi-list"></div>


<div class="vue-component chart" data-source="/charts/head-pitch-mask-set.json"></div>


*Butterfly Lovers (梁祝)*
<div class="vue-component midi-head-mask" data-time-scale="0.018">
	{
		"notes": [{"start":90,"duration":680,"velocity":56,"pitch":74},{"start":632.5,"duration":610,"velocity":63,"pitch":71},{"start":1145,"duration":587.5,"velocity":73,"pitch":69},{"start":1742.5,"duration":585,"velocity":38,"pitch":55},{"start":1752.5,"duration":2230,"velocity":53,"pitch":67},{"start":2370,"duration":577.5,"velocity":45,"pitch":62},{"start":2850,"duration":552.5,"velocity":68,"pitch":59},{"start":3305,"duration":615,"velocity":64,"pitch":57},{"start":3907.5,"duration":2385,"velocity":47,"pitch":55},{"start":4522.5,"duration":657.5,"velocity":76,"pitch":69},{"start":5022.5,"duration":632.5,"velocity":84,"pitch":66},{"start":5530,"duration":550,"velocity":81,"pitch":64},{"start":6080,"duration":2265,"velocity":50,"pitch":62},{"start":6597.5,"duration":655,"velocity":59,"pitch":57},{"start":7157.5,"duration":567.5,"velocity":61,"pitch":54},{"start":7672.5,"duration":557.5,"velocity":51,"pitch":52},{"start":8242.5,"duration":1367.5,"velocity":43,"pitch":50},{"start":8955,"duration":537.5,"velocity":69,"pitch":78},{"start":9450,"duration":502.5,"velocity":89,"pitch":76},{"start":9952.5,"duration":562.5,"velocity":95,"pitch":78}]
	}
</div>


*Étude Op. 10, No. 3 (Chopin)*
<div class="vue-component midi-head-mask" data-time-scale="0.03">
	{
		"notes": [{"start":93.75,"duration":243.75,"velocity":41,"pitch":59},{"start":984.375,"duration":1338.541666666666,"velocity":49,"pitch":64},{"start":1015.625,"duration":1635.416666666666,"velocity":25,"pitch":40},{"start":1027.083333333333,"duration":692.708333333333,"velocity":32,"pitch":56},{"start":1667.708333333333,"duration":697.9166666666661,"velocity":34,"pitch":59},{"start":1677.083333333333,"duration":741.6666666666661,"velocity":24,"pitch":47},{"start":2183.333333333333,"duration":659.375,"velocity":53,"pitch":63},{"start":2183.333333333333,"duration":702.083333333333,"velocity":34,"pitch":56},{"start":2704.166666666666,"duration":648.9583333333321,"velocity":51,"pitch":64},{"start":2704.166666666666,"duration":765.6249999999991,"velocity":36,"pitch":59},{"start":2704.166666666666,"duration":797.9166666666661,"velocity":23,"pitch":47},{"start":3258.333333333332,"duration":644.791666666667,"velocity":29,"pitch":57},{"start":3268.749999999999,"duration":2665.624999999999,"velocity":51,"pitch":66},{"start":3280.208333333332,"duration":2803.125,"velocity":36,"pitch":63},{"start":3301.041666666665,"duration":1448.958333333333,"velocity":28,"pitch":35},{"start":3852.083333333332,"duration":396.875,"velocity":30,"pitch":59},{"start":3862.499999999999,"duration":471.8749999999991,"velocity":24,"pitch":47},{"start":4344.791666666664,"duration":596.875,"velocity":28,"pitch":57},{"start":4857.291666666664,"duration":705.2083333333339,"velocity":28,"pitch":59},{"start":4867.70833333333,"duration":422.9166666666679,"velocity":26,"pitch":47}]
	}
</div>


*Fur Elise*
<div class="vue-component midi-head-mask" data-time-scale="0.04">
	{
		"notes": [{"start":91.66666666666652,"duration":374.99999999999955,"velocity":41,"pitch":76},{"start":419.79166666666606,"duration":329.16666666666697,"velocity":68,"pitch":75},{"start":698.958333333333,"duration":301.04166666666606,"velocity":55,"pitch":76},{"start":941.6666666666661,"duration":309.375,"velocity":51,"pitch":75},{"start":1197.916666666666,"duration":292.70833333333394,"velocity":52,"pitch":76},{"start":1439.583333333333,"duration":293.75,"velocity":48,"pitch":71},{"start":1668.75,"duration":317.70833333333303,"velocity":59,"pitch":74},{"start":1904.166666666666,"duration":273.95833333333394,"velocity":48,"pitch":72},{"start":2150,"duration":239.58333333333303,"velocity":56,"pitch":69},{"start":2184.375,"duration":835.4166666666661,"velocity":34,"pitch":45},{"start":2408.333333333333,"duration":565.625,"velocity":45,"pitch":52},{"start":2642.708333333333,"duration":139.58333333333303,"velocity":45,"pitch":57},{"start":2888.541666666666,"duration":286.45833333333303,"velocity":57,"pitch":60},{"start":3115.624999999999,"duration":403.125,"velocity":65,"pitch":64},{"start":3356.249999999999,"duration":285.41666666666606,"velocity":65,"pitch":69},{"start":3578.124999999999,"duration":754.166666666667,"velocity":62,"pitch":71},{"start":3602.083333333332,"duration":197.91666666666697,"velocity":41,"pitch":40},{"start":3843.749999999999,"duration":201.04166666666697,"velocity":44,"pitch":52},{"start":4061.458333333333,"duration":59.375,"velocity":60,"pitch":56},{"start":4290.625,"duration":362.5,"velocity":48,"pitch":64}]
	}
</div>



---
[^1]: Paper: [MIDIZ: content based indexing and retrieving MIDI files](http://www.scielo.br/scielo.php?script=sci_arttext&pid=S0104-65001999000300002)
[^2]: MIDIZ use 2<sup>k</sup>-1 dimensional vectors, usually set k=3.



<script src="/vue/chunk-vendors.js"></script>
<script src="/vue/midi-pitches-counter.js"></script>
<script src="/vue/midi-pitches-mask.js"></script>
<script src="/vue/chart.js"></script>
<script src="/vue/midi-head-mask.js"></script>
<script src="/vue/soundfont-loader.js"></script>
