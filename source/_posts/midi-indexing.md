---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: A proposal for content based MIDI files indexing and retrieving on piano
tags:
  - music
  - midi
coauthor: k-l-lambda
mathjax: true
date: 2020-03-08 13:12:57
---


<figure>
	<picture>
		<source srcset="/images/gfind-crystal.webp" type="image/webp" />
		<source srcset="/images/gfind-crystal.png" type="image/png" />
		{% img figure /images/gfind-crystal.png 400 '"" "smart piano"' %}
	</picture>
	<figcaption>A smart piano.</figcaption>
</figure>

## Motivation

Imagine you have a smart piano at home, which is connected with a huge music staff library.
Once, you want to play some music opus on a whim, and it's so bothering to retrieve music staff in either category menus or a long favorite list,
therefore, you just play by memory directly.
But the piano is so smart. Just a few seconds later, it understands what you are playing and displays the staff automatically.

Let's look at another case: you see a nice piano when hanging out downtown and you are just in a mood to play a piece of music and show off your talent to passers.
When you sit and play, surprisingly, the piano displays the music information about what you are playing.
When you finish, it says, well done! Your performence beat 95% players on this opus.

Imaginary scenes above are coming true. Now let's talk about some ideas for implementing such a technique.

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

However, for our particular purpose of piano playing, there are some issues in this scheme:

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
As hint by the word *guess* (or *fuzzy*), the program will output a confidence value to tell how confident it believes itself result.

Now, what if we use a wrong score to follow? Obviously, any possible guessing won't be with a high confidence.
Probably some fragment in user playing sequence is similar with the (wrongly) specific score someplace, but the matching must be highly fragmentized.
If we measure the typical continuous following length with a proper confidence threshold, a normal score following will completely beat a wrong score following.

So now we have a touchstone to check how well a music score match what user is playing, and if we run this program on all scores we possess simultaneously,
we are able to pick the best matching score by results sorting. Certainly, it's not practicable&#x1f604;.
However, if we sieve off those obvious impossible candidates, and a small left magnitude can be affordable.
So this is the rough phase, the design aim is fast and concurrency, not precise. And for possible candidates, rather let it go than kill.

To construct a MIDI indexing, available properties of music piece include pitch, time and velocity (strength).
Velocity/strength is out firstly because of its highly mutable.
Time property is valuable to identify a score, but the time data recorded from human playing is usually recorded in millisecond or microsecond,
which is very continuous (in contrast, pitch values from keyboard instrument are always discrete in semitone), and difficult to extract identify information.
However, the time information utilizing is an open problem to exploit in future.

Inevitably, pitch is the last option.
To fast index scores, we convert the pitch characteristic of entire candidate score (or user playing) notes into serval integer numbers.
The filter operation, pass or failure judgement is done by binary number calculation, which is fast and constant to single score length
($O(n)$ to candidate scores count, but can be optimized by concurrency).

The pitch characteristic is accumulatable to notes, and a music piece with more notes has stronger characteristic,
i.e. as user keep playing, more and more candidate scores will be sieved off.
Once candidate scores count is lower than an affordable threshold, we will run the fine phase.

We define an efficiency benchmark:

$$ \textrm{filter stregth} := 1 - \frac{\textrm{left candidate count}}{\textrm{total candidate count}} $$

As long as we didn't miss the potential goal score, we will do our best to enhance the filter strength.


## Pitch frequency indexing

For a particular MIDI file, the attendance frequency of every pitch can be used as a unique signature.
Try to play this MIDI file, and the histogram below will illustrate what is *pitch frequency* we talk about.

<div class="vue-component midi-pitches-counter" data-midi-url="/midi/Minuets_in_G_major.mid"></div>

When someone is playing a song A, let's use $\textbf{A}$ to denote the notes set of song A,
and $\textbf{B}$ to denote the notes set which the user has played by now.
Supposing the user's playing has no errors, we have $\textbf{B} \subseteq \textbf{A}$.
And for another different song C, we have some chance that $\textbf{B} \nsubseteq \textbf{C}$,
or $\textbf{B} \cap \overline{\textbf{C}} \neq \phi$.
As playing goes on, the probability of B over C keeps increasing.

We can just compare every pitch frequency one by one to perform the checking,
but dozens integer comparing per song has heavy costs for a large library.
We optimize this by coarsen pitch frequency histogram to several bit mask codes.
Piano has 88 keys, rather than to store 88 numbers vertically, we can also store the information horizontally,
i.e. by a 88 bits binary number, whose each bit represents one pitch's attendance/absence.
Furthermore, we set **T** thresholds (for example: T=4),
and use T bit mask codes to store whether each pitch frequency number is over the corresponding threshold.

To choose these thresholds reasonably, we plot the pitch frequency distribution graph for a typical music set,
which contains hundreds popular classical and modern songs.

<figure>
	<div class="vue-component chart" data-type="Line" data-source="/charts/score-pitch-frequency-dist.json"></div>
	<figcaption>
		Concat all pitch frequency columns of 243 popular songs togather, and sort them by value.
	</figcaption>
</figure>

To tolerate sporadic error notes, we set the lowest threshold to 4. And for columns above 4, we divide pitch columns to four sections equally.
Then the values on every boundary are our thresholds. Coincidentally, they are exactly on powers of 2.

Here is an example, the entire MIDI's pitch frequency histogram of _Minuet in G Major_:

<div class="vue-component chart" data-source="/charts/pitch-histogram-minuet-in-Gmajor.json"></div>

And the coarsen result:

<div class="vue-component chart" data-source="/charts/pitch-mask-minuet-in-Gmajor.json"></div>

All frequency columns are coarsen to four ranks according to thresholds of 4, 8, 16, 32.
Finally we get four bit masks (converting black blocks to 1, white blocks to 0):

```
  0b0000000000000000000000100000010101101011010101101011110101101010000000000000000000000000
  0b0000000000000000000000000000010001101011010001101011110101100000000000000000000000000000
  0b0000000000000000000000000000000000101011010000101011010100000000000000000000000000000000
  0b0000000000000000000000000000000000000000000000101011010000000000000000000000000000000000
```

Then we can simply define the check function like this:

```javascript
maskCheck = (query, song) => (query & ~song) == 0;

songCheck = (queryMasks, songMasks) =>
	   maskCheck(queryMasks[0], songMasks[0])
	&& maskCheck(queryMasks[1], songMasks[1])
	&& maskCheck(queryMasks[2], songMasks[2])
	&& maskCheck(queryMasks[3], songMasks[3]);
```

So we store pitch frequency masks for every songs in DB, and we compute masks for user played notes in real time.
Then we can do a high performence music indexing.

Technically, we can encode these mask codes into 11 32-bits integers (88&times;4=32&times;11),
ordered by from center to both sides (because center area has more 1s thasn margins usually).
To reduce calculation, we exclude pure zeros in query mask codes before comparing, because zero mask won't sieve off any songs.
And we can perform multiple passes for each query code, every pass is only performed on the rest songs after prior sifts.
However, all above are suggestions, the algorithm details should depend on your hardware implementation and low-level APIs.

Here is a live demo to illustrate how this work:

<figure>
	<datalist id="midi-list">
		<option value="/midi/Turkish_Rondo.mid">
		<option value="/midi/Minuets_in_G_major.mid">
		<option value="/midi/Fur_Elise.mid">
		<option value="/midi/Chopin_Nocturne_in_E_flat_major.mid">
		<option value="/midi/Ballade_pour_Adeline.mid">
		<option value="/midi/Wings_of_Silence.mid">
	</datalist>
	<div class="vue-component midi-pitches-mask" data-source-list="#midi-list"></div>
	<figcaption style="text-align: left">
		<span style="color: #3ea6ef">&#x275a;</span> coarse pitch histogram of candidate MIDI<br/>
		<span style="color: #00e5b0">&#x275a;</span> full pitch histogram of query MIDI<br/>
		<span style="color: red">&#x275a;</span> coarse pitch histogram of query MIDI<br/>
	</figcaption>
</figure>

You may notice that some song takes quite a long time to exclude all other songs.
Firstly, our purpose for this phase is not exclude all other songs, but shrink the possible range into an affordable size.
Secondly, we have another supplementary trick in next chapter.

## Head pitch mask indexing

In most cases, people play a piece of music from beginning rather than from somewhere middle.
Pitches combination to the head a few notes is also a characteristic signature.
So we can use the head pitch mask indexing as an alternative music sift method,
if this failed, i.e. too many songs left or none left (maybe user is not playing from beginning),
we then perform pitch frequency indexing.

In head pitch mask indexing, we only store one mask number to represent attendance/absense of each pitch.
We pick notes from head of a song, according to these rules:

1. Pick 10 notes at most, because people has 10 fingers, and for piano score, 10 notes must contain the entire first chord.[^3]

2. Unless conficted with *rule 1*, pick **N** difference pitches at least. N is a constant which we will talk about later.

3. Unless conficted with *rule 1*, end of picked notes must contains an entire chord.
To tolerate tendency order error when user play chord, arpeggio or some fast music progress,
we choose an tolerance interval $\epsilon$ (for example, $\epsilon$=120ms),
the last picked note's begin time $t_x$ must satisfy:
$$t_{x+1} - t_{x} > \epsilon$$

For generating masks of candidate songs, we obey all rules.
And for query mask, we ignore *rule 3* to guarantee query mask is a subset of candidate mask for the same song.

Here are examples:

* *Butterfly Lovers (梁祝)*
<div class="vue-component midi-head-mask" data-time-scale="0.018">
	{
		"notes": [{"start":90,"duration":680,"velocity":56,"pitch":74},{"start":632.5,"duration":610,"velocity":63,"pitch":71},{"start":1145,"duration":587.5,"velocity":73,"pitch":69},{"start":1742.5,"duration":585,"velocity":38,"pitch":55},{"start":1752.5,"duration":2230,"velocity":53,"pitch":67},{"start":2370,"duration":577.5,"velocity":45,"pitch":62},{"start":2850,"duration":552.5,"velocity":68,"pitch":59},{"start":3305,"duration":615,"velocity":64,"pitch":57},{"start":3907.5,"duration":2385,"velocity":47,"pitch":55},{"start":4522.5,"duration":657.5,"velocity":76,"pitch":69},{"start":5022.5,"duration":632.5,"velocity":84,"pitch":66},{"start":5530,"duration":550,"velocity":81,"pitch":64},{"start":6080,"duration":2265,"velocity":50,"pitch":62},{"start":6597.5,"duration":655,"velocity":59,"pitch":57},{"start":7157.5,"duration":567.5,"velocity":61,"pitch":54},{"start":7672.5,"duration":557.5,"velocity":51,"pitch":52},{"start":8242.5,"duration":1367.5,"velocity":43,"pitch":50},{"start":8955,"duration":537.5,"velocity":69,"pitch":78},{"start":9450,"duration":502.5,"velocity":89,"pitch":76},{"start":9952.5,"duration":562.5,"velocity":95,"pitch":78}]
	}
</div>

* *Étude Op. 10, No. 3 (Chopin)*
<div class="vue-component midi-head-mask" data-time-scale="0.03">
	{
		"notes": [{"start":93.75,"duration":243.75,"velocity":41,"pitch":59},{"start":984.375,"duration":1338.541666666666,"velocity":49,"pitch":64},{"start":1015.625,"duration":1635.416666666666,"velocity":25,"pitch":40},{"start":1027.083333333333,"duration":692.708333333333,"velocity":32,"pitch":56},{"start":1667.708333333333,"duration":697.9166666666661,"velocity":34,"pitch":59},{"start":1677.083333333333,"duration":741.6666666666661,"velocity":24,"pitch":47},{"start":2183.333333333333,"duration":659.375,"velocity":53,"pitch":63},{"start":2183.333333333333,"duration":702.083333333333,"velocity":34,"pitch":56},{"start":2704.166666666666,"duration":648.9583333333321,"velocity":51,"pitch":64},{"start":2704.166666666666,"duration":765.6249999999991,"velocity":36,"pitch":59},{"start":2704.166666666666,"duration":797.9166666666661,"velocity":23,"pitch":47},{"start":3258.333333333332,"duration":644.791666666667,"velocity":29,"pitch":57},{"start":3268.749999999999,"duration":2665.624999999999,"velocity":51,"pitch":66},{"start":3280.208333333332,"duration":2803.125,"velocity":36,"pitch":63},{"start":3301.041666666665,"duration":1448.958333333333,"velocity":28,"pitch":35},{"start":3852.083333333332,"duration":396.875,"velocity":30,"pitch":59},{"start":3862.499999999999,"duration":471.8749999999991,"velocity":24,"pitch":47},{"start":4344.791666666664,"duration":596.875,"velocity":28,"pitch":57},{"start":4857.291666666664,"duration":705.2083333333339,"velocity":28,"pitch":59},{"start":4867.70833333333,"duration":422.9166666666679,"velocity":26,"pitch":47}]
	}
</div>

* *Fur Elise*
<div class="vue-component midi-head-mask" data-time-scale="0.04">
	{
		"notes": [{"start":91.66666666666652,"duration":374.99999999999955,"velocity":41,"pitch":76},{"start":419.79166666666606,"duration":329.16666666666697,"velocity":68,"pitch":75},{"start":698.958333333333,"duration":301.04166666666606,"velocity":55,"pitch":76},{"start":941.6666666666661,"duration":309.375,"velocity":51,"pitch":75},{"start":1197.916666666666,"duration":292.70833333333394,"velocity":52,"pitch":76},{"start":1439.583333333333,"duration":293.75,"velocity":48,"pitch":71},{"start":1668.75,"duration":317.70833333333303,"velocity":59,"pitch":74},{"start":1904.166666666666,"duration":273.95833333333394,"velocity":48,"pitch":72},{"start":2150,"duration":239.58333333333303,"velocity":56,"pitch":69},{"start":2184.375,"duration":835.4166666666661,"velocity":34,"pitch":45},{"start":2408.333333333333,"duration":565.625,"velocity":45,"pitch":52},{"start":2642.708333333333,"duration":139.58333333333303,"velocity":45,"pitch":57},{"start":2888.541666666666,"duration":286.45833333333303,"velocity":57,"pitch":60},{"start":3115.624999999999,"duration":403.125,"velocity":65,"pitch":64},{"start":3356.249999999999,"duration":285.41666666666606,"velocity":65,"pitch":69},{"start":3578.124999999999,"duration":754.166666666667,"velocity":62,"pitch":71},{"start":3602.083333333332,"duration":197.91666666666697,"velocity":41,"pitch":40},{"start":3843.749999999999,"duration":201.04166666666697,"velocity":44,"pitch":52},{"start":4061.458333333333,"duration":59.375,"velocity":60,"pitch":56},{"start":4290.625,"duration":362.5,"velocity":48,"pitch":64}]
	}
</div>


To choose a proper value for **N**, we plot the diversity graph of head pitch masks.

<figure>
	<div class="vue-component chart" data-source="/charts/head-pitch-mask-set.json"></div>
	<figcaption>
		Counts of unique head pitch masks to every N value, in a 4013 songs MIDI library.
	</figcaption>
</figure>

We want to maximize head pitch mask diversity, i.e. minimize the cases of duplicated mask for different MIDI files.
So we choose N=5, which coincide with my intuition.
But a little surprised, we observed that the diversity to N of greater than 5 decreases quickly.


## Next step

In our experiment, we run our retrieving program on a MIDI music library of about 6,000 songs.
We try *head pitch mask indexing* + *score following evaluation* firstly.
If this failed (usually by no any song left after indexing[^4], or all score following evaluation's result values are too low),
we try *pitch frequency indexing* every 16 notes by user playing, once left songs count is less than 100, then run score following evaluation.
We observed that about 60% tests can be accomplished by first method (head + following),
and among the rest of cases, about 80% tests can be accomplished in first 2 attempts (32 notes).
Benefit from high performance score following algorithm, most retrieving tests can be accomplished in 20 seconds (from when first note played).

There are also some pending issues, such as splitting problem.
When our program continuously listens to multiple songs from user, how to precisely determine where is the songs' boundary?
Regarding people playing's improvisity, score following won't give a reasonable answer always.
When to break score following state and return to a new retrieving, that's an open question.
I think we need a sophisticated policy to integrate score following results and notes' interval information.


---
[^1]: Paper: [MIDIZ: content based indexing and retrieving MIDI files](http://www.scielo.br/scielo.php?script=sci_arttext&pid=S0104-65001999000300002)
[^2]: MIDIZ use 2<sup>k</sup>-1 dimensional vectors, usually set k=3.
[^3]: The notes count up limit is to avoid some song with too many repeat pitches at head, which may delay query.
[^4]: Probably because of user played error notes in head.



<script src="/vue/chunk-vendors.js"></script>
<script src="/vue/midi-pitches-counter.js"></script>
<script src="/vue/midi-pitches-mask.js"></script>
<script src="/vue/chart.js"></script>
<script src="/vue/midi-head-mask.js"></script>
<script src="/vue/soundfont-loader.js"></script>
