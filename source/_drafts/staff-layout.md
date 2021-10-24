---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: A concise representation of sheet music vertical structure
coauthor: k-l-lambda
tags:
  - sheet music
  - DSL
---

In the previous post [A domain-specific language for sheet music paragraph layout](/2020/11/15/music-layout-language/),
we discussed how to concisely represent sheet music paragraph structure in computer.
Orthogonally, we also need to express the sheet music vertical structure: instruments, staves, voices and their relationship.

<figure>
	<a href="/images/conductor-music-score-sample.png" target="_blank">
		{% img figure /images/conductor-music-score-sample.png 480 '"" "conductor music score sample"' %}
	</a>
	<figcaption>
		An example for sheet music vertical structure,<br />
		we represents this by <em><[-]----><[-]--[-]->{-}</em>
	</figcaption>
</figure>

We aim to do this concisely and intuitively.
And this will be a meta-language which can be exported to other music languges,
such as [Lilypond](https://lilypond.org/), [MusicXML](https://www.musicxml.com/) and [MEI](https://music-encoding.org/).

<!-- more -->


## The first example

I call this mini language *staff layout code*. This is our 'hello world':

<div class="vue-component staff-layout-viewer" data-init-code="a,b,c" data-read-only="1"></div>

We can name every staff by an identifier, a string made up with alphabet, number and underscore.

## Conjunctions

<div class="vue-component staff-layout-viewer" data-init-code="a-b.c,d" data-read-only="1"></div>

We define barlines between staves in 3 types: solid `-`, dashed `.` and blank `,`.
And the blank type is default, can be ignored:

<div class="vue-component staff-layout-viewer" data-init-code="a b c" data-read-only="1"></div>

## Anonymous staves

<div class="vue-component staff-layout-viewer" data-init-code=" , , " data-read-only="1"></div>

Staff names is not required to specify. Unnamed staves have number name by default.
As a result, the empty string "" is a valid staff layout code, and it represents an anonymous single staff:

<div class="vue-component staff-layout-viewer" data-init-code=" " data-read-only="1"></div>

## Brackets

The grand staff:

<div class="vue-component staff-layout-viewer" data-init-code="{RH-LH}" data-read-only="1"></div>

We have 3 types of brackets: bracket `<>`, brace `{}` and square bracket `[]`.

And you can imagine that rotate the code by 90&deg; to corresponds the sheet music:

<div class="vue-component staff-layout-viewer" data-init-code="<[-].> {-} <>" data-read-only="1" data-show-annotation="1"></div>

# Instrument names

Beside staff layout code, we can define the instrument names by a name dictionary.

<div class="vue-component staff-layout-viewer" data-init-code=" ,{ - }" data-init-name-dict="{1: 'Voice', '2-3': 'Piano'}" data-read-only="1"></div>

For [the example picture](/images/conductor-music-score-sample.png) above, the complete representation is:

<div class="vue-component staff-layout-viewer" data-init-code="<[fl-cl]-bcl-asx-tsx-tr> <[vl1-vl2]-viola-[cello1-cello2]-cb> {p1-p2}" data-init-name-dict="{fl: 'Flute 1', cl: 'Clarinet 1', bcl:'Bass Clarinet', asx: 'Alto Saxophone', tsx: 'Tenor Saxophone', tr: 'Trumpet', vl1: 'Violin 1', vl2: 'Violin 2', viola: 'Viola', cello1: 'Cello 1', cello2: 'Cello 2', cb: 'Contrabass', 'p1-p2': 'Piano'}" data-scale="0.7" data-read-only="1"></div>

## Try it yourself

Try to customize your own staff layout in below.

<div class="vue-component staff-layout-viewer" data-init-code="{-}{-}" data-init-name-dict="{'1-2': 'Piano I', '3-4': 'Piano II'}"></div>

We will open source the language library after some arrangement work.



<script src="/vue/chunk-vendors.js"></script>
<script src="/vue/staff-layout-viewer.js"></script>
