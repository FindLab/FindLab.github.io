---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: A domain-specific language for sheet music paragraph layout
tags:
  - sheet music
  - DSL
  - lilypond
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

## How to express music paragraph layout

We should design this language as intuitive as possible, make it understandable to users without any computer programming knowledges.

Let's start with a simple example:

![layout-sample-simple](/images/music-score/layout-sample-simple.svg)

Code:
```
1, 2, 3, 4
```

The code is simply the list of measure indices.

Before more complicated examples, let's take this two-parts score as a transition:

![layout-sample-2-segments](/images/music-score/layout-sample-2-segments.svg)

Code:
```
[1, 2, 3, 4], [5, 6, 7, 8]
```

Here brackets '[]' are used to segment measure indices into paragraphs.

For a long score, writing all serial numbers is tedious, so we adopt this brief form:

```
[1..4], [5..8]
```

<!-- more -->

Till now we call these code as *index-wise* form.
You may notice that this form has an implicit rule that users must keep numbers continuous themselves,
theoretically someone can write a semantic-ill code like `1, 3, 2, 4` or `[1..4], [3..6]`, which make no sense.
So we create another *segment-wise* form, which may be more favourite for some developers. For the last example, it's like:

```
s: 4 4
```

Here `4` stand for a measure segment with length 4.
To distinguish against index-wise, we must use a prefix of `s:`. 2 tips:
* Also you can use `i:` to explicitly specify form for index-wise, and because it's the default form, so can be ignored.
* You can also write brackets around every number in segment-wise code, but we prefer the brief form to ignore them.
	And also for brief, no commas.

However, we think to write measure indices explicitly for measure range is an advantage in most time, so we use index-wise as the default form.

Next, the repeat example:

![layout-sample-volta](/images/music-score/layout-sample-volta.svg)

Index-wise:

```
2*[1, 2], 3
```

Segment-wise:

```
s: 2*[2] 1
```

`n*` stands for repeat a measure segment *n* times.
After `n*`, there must be a bracketed measure segment.

Repeat with alternative postfixes:

![layout-sample-alternative](/images/music-score/layout-sample-alternative.svg)

Index-wise:

```
2*[1, 2]{3, 4}
```

Segment-wise:

```
s: 2*[2]{1 1}
```

Inside parantheses `{}` should be 2 or more measure segments or single measure indices.


# Next step

It still leaves over some pending issues with this language, we are considering some more grammar elements to express:

*	time signature change
*	partial measures
*	anacrusis (upbeat beginning) music
