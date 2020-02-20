---
author: k-l-lambda
coauthor: k-l-lambda
email: k-l-lambda@gmail.com
title: A proposal for content based MIDI files indexing and retrieving on piano
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

## Related works

Early in 1999, Cavalcanti et al. proposed a MIDI indexing system scheme[^1].
The system converts a melody notes sequence into a sequence of 7 dimensional[^2] feature vectors,
and then match query melody notes by measuring Euclidean distance between feature vectors.


[^1]: paper: [MIDIZ: content based indexing and retrieving MIDI files](http://www.scielo.br/scielo.php?script=sci_arttext&pid=S0104-65001999000300002)
[^2]: MIDIZ use 2<sup>k</sup>-1 dimensional vectors, usually set k=3.
