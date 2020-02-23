---
author: k-l-lambda
coauthor: k-l-lambda
email: k-l-lambda@gmail.com
title: A proposal for content based MIDI files indexing and retrieving on digital piano
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
Once a time, you wanna play some muic opus on a whim, and it's so bothering that retrieve music staff in either category menus or a long favorite list,
so you just play by memory directly.
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
pitch histogram indexing and music fuzzy matching. The second phase is also a robust score following algorithm,
which play a key role in the smart piano user interactive system, a pending patent.
I hope there is another opportunity to talk details of the score following method. Now we focus on the first phase.


## Pitch histogram indexing


---
[^1]: paper: [MIDIZ: content based indexing and retrieving MIDI files](http://www.scielo.br/scielo.php?script=sci_arttext&pid=S0104-65001999000300002)
[^2]: MIDIZ use 2<sup>k</sup>-1 dimensional vectors, usually set k=3.
