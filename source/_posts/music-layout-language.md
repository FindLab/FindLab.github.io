---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: A domain-specific language for sheet music paragraph layout
tags:
  - sheet music
  - DSL
  - lilypond
author: k-l-lambda
email: k.l.lambda@gmail.com
date: 2020-11-15 16:55:39
---


<style>
	.highlight .gutter pre
	{
		color: #86919433;
	}
</style>

## Motivation

To avoid redundant writing, there are several repeat types in sheet music to organize paragraph layout.
So when performing music, instead of simply from beginning to the end in order, one should obey musical signs to jump position.
Probably we can separate music paragraph layout information from music staff content when recording a sheet music.
I.e., create a new tiny domain-specific language to express sheet music structure.
It's especially meaningful for computer musical lanugages, such as [Lilypond](https://lilypond.org/) and [ABC Notation](http://abcnotation.com/).
Consider this: for a multiple voices music, in voice-wise form, we must record the repeat symbols in every voice,
and carefully keep them consistent to avoid weird errors.
And for the languages' implementation, it's troublesome to handle this kind semantic error.
For users, it's covert and confused.
Once we can record the music paragraph layout individually, we can simply record multiple voice staff in a 2-d table form, a measure-voice matrix, like this:

|			| measure 1 | measure 2 | measure 3 | ...	|
|:---------:|:---------:|:---------:|:---------:|:-----:|
|**voice 1**|			|			|			|		|
|**voice 2**|			|			|			|		|
|...		|			|			|			|		| |

This regular form will facilitate music score clipping/slicing, which is useful for music education courseware and instrument training.
And it also facilitates music-related deep learning tasks, such as [OMR](https://en.wikipedia.org/wiki/Optical_music_recognition), AI music composition and so on.

## How to express a music paragraph layout

We should design this language as intuitive as possible, make it understandable to users without any computer programming knowledges.


Let's start with a simple example:

### Example 1
![layout-sample-simple](/images/music-score/layout-sample-simple.svg)

Code:
```
1, 2, 3, 4
```

The code is simply the list of measure indices.


Before more complicated examples, let's take this two-parts score as a transition:

### Example 2
![layout-sample-2-segments](/images/music-score/layout-sample-2-segments.svg)

Code:
```
[1, 2, 3, 4], [5, 6, 7, 8]
```

Here brackets '[]' are used to segment measure indices into paragraphs.

For a long score, writing all serial numbers is tedious, so we adopt this brief form as a syntactic sugar:

```
[1..4], [5..8]
```

<!-- more -->

Till now we call these code as *index-wise* form.
You may notice that this form has an implicit rule that users must keep numbers continuous themselves,
theoretically someone can write a semantic-ill code like `1, 3, 2, 4` or `[1..4], [3..6]`, which make no sense.
So we create another *segment-wise* form, which may be more favourite for some developers. For *example 2*, it's like:

```
s: 4 4
```

Here `4` stands for a measure segment with length 4.
To distinguish against index-wise, we must use a prefix of `s:`. And here are 2 tips:
* Also you can use `i:` to explicitly specify form for index-wise, but because it's the default form, so can be ignored.
* You can also write brackets around every number in segment-wise code, but we prefer the brief form to ignore them.
	And also for brief and distinguishing, no commas.

However, we think to write measure indices explicitly for measure ranges is an advantage in most of time, so we adopt the index-wise as the default form.


Next, the repeat example:

### Example 3, simple repeat
![layout-sample-volta](/images/music-score/layout-sample-volta.svg)

Index-wise code:

```
2*[1, 2], 3
```

Segment-wise code:

```
s: 2*[2] 1
```

`n*` stands for repeat a measure segment *n* times.
After `n*`, there must be a bracketed measure segment.

The expanded measure index list will be:

```
1 2 | 1 2 | 3
```

Notice that the *expanded measure index list* is **not** a part of our new language, just a text for illustration.


Repeat with alternative postfixes:

### Example 4, repeat-alternative
![layout-sample-alternative](/images/music-score/layout-sample-alternative.svg)

Index-wise code:

```
2*[1, 2]{3, 4}
```

Segment-wise code:

```
s: 2*[2]{1 1}
```

Expanded measure index list:

```
1 2 | 3 | 1 2 | 4
```

Inside braces `{}` should be 2 or more measure segments or single measure indices.


Next, for some advanced repeat types.
We observed that, all the forms of *Da Capo*/*Dal Segno* *al* *Fine*/*Coda* can be abstracted into an 'ABA' type:

```
<A, B> => A B A
```

Here `A` `B` stand for 2 measure segments.

For instance, that's:

| Music form | Expanded segments |
|:----------:|:-----------------:|
|	**A** `Fine` **B** `D.C. al Fine`								| **A B A** |
|	X &#x1D10B; **A** `Fine` **B** `D.S. al Fine`					| X **A B A** |
|	**A** &#x1D10C; **B** `D.C. al Coda` &#x1D10C; Y				| **A B A** Y |
|	X &#x1D10B; **A** &#x1D10C; **B** `D.S. al Coda` &#x1D10C; Y	| X **A B A** Y |

If you know some exceptional cases, please tell us.

Take these 2 examples to illustrate it:

### Example 5, Da Capo al Fine
![layout-sample-DCalFine](/images/music-score/layout-sample-DCalFine.svg)

Index-wise code:

```
<[1, 2], 3, 4>
```

Segment-wise code:

```
s: <2 2>
```

Expanded measure index list:

```
1 2 | 3 4 | 1 2
```

Inside chevrons `<>` is a list of measure segments, which the first item of the list will be repeated once.

### Example 6, Dal Segno al Coda
![layout-sample-DSalCoda](/images/music-score/layout-sample-DSalCoda.svg)

Index-wise code:

```
1..4, <[5, 6], 7..12>, 13, 14
```

Segment-wise code:

```
s: 4 <2 6> 2
```

Expanded measure index list:

```
1 2 3 4 | 5 6 | 7 8 9 10 11 12 | 5 6 | 13 14
```


At last, let's show a miscellaneous example.

### Example 7

The music score is too long to show, click this link to see the sheet: [*Má vlast*](/images/music-score/ma-vlast.svg)

Index-wise code:

```
1, <[2*[2..8]{9, 10}, 11..27], 2*[28..34]{35, 36}, 37>, 38..61
```

Segment-wise code:

```
s: 1 <[2*[7]{1 1} 17] 2*[7]{1 1} 1> 24
```

Expanded measure index list:

```
1
2 3 4 5 6 7 8 | 9 | 2 3 4 5 6 7 8 | 10
11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
28 29 30 31 32 33 34 | 35 | 28 29 30 31 32 33 34 | 36
37
2 3 4 5 6 7 8 | 10 | 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61
```

## An application demo

This is a video demo to illustrate how our new language code is working with Lilypond when composing a music score.

{% youtube uUOV-Kjrt4M %}

## Grammar live test

We have implemented a basic grammar parser by [JISON](https://zaa.ch/jison/) (the javascript version of BISON).
Try it yourself at this link:

[**JISON debugger**](https://k-l-lambda.github.io/klstudio/jison-debugger/#grammar=https%3A%2F%2Fraw.githubusercontent.com%2Fk-l-lambda%2Flotus%2Fmaster%2Fjison%2FmeasureLayout.jison|2*%5B1..4%5D%7B5%2C6%7D)

## Next step

It still leaves over some pending issues with this language, we are considering some more grammar elements to express:

*	Unspecified index list, to allow user to ignore indices at score boundary, as `..` instead of `1..8`, and `2*[..4], 5..` instead of `2*[1..4], 5..8`.
*	Time signature change
*	Partial measures & sub-measure time mark
*	Anacrusis (upbeat beginning) music

Welcome to discuss some more features you want.
