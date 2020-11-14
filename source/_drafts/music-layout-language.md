---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: A domain-specific language for sheet music paragraph layout
tags:
  - sheet music
  - DSL
  - lilypond
---

To avoid redundant writing, there are several repeat types in sheet music to organize paragraph layout.
So when performing music, instead of simply from beginning to the end in order, one should obey musical signs to jump position.
Probably we can separate music paragraph layout information from music staff content when recording a sheet music.
I.e., create a new tiny domain-specific language to express sheet music structure.
It's especially meaningful for computer musical lanugages, such as [Lilypond](https://lilypond.org/) and [ABC Notation](http://abcnotation.com/).
Consider this: for a multiple voices music, in voice-wise form, we must record the repeat symbols in every voice,
and carefully keep the them consistent to avoid potential errors.
And for the languages' implementation, that's troublesome to handle this kind semantic error.
For users, it's covert and confused.
Once we can record the music paragraph layout individually, we can simply record multiple voice staff in a 2-d table form, a measure-voice matrix, like this:

|			| measure 1 | measure 2 | measure 3 | ...
|-----------|-----------|-----------|-----------|----
|voice 1	|			|			|			|	
|voice 2	|			|			|			|	
|...		|			|			|			|	



It still leaves over some pending issues with this language, they are some more grammar elements to express:

*	time signature change
*	partial measure
*	anacrusis (upbeat beginning) music
