---
author: k-l-lambda
email: k.l.lambda@gmail.com
title: staff-layout
coauthor: k-l-lambda
tags:
  - sheet music
  - DSL
---


<div class="vue-component staff-layout-viewer" data-init-code="a,b,c" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code="a-b.c,d" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code="a b c" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code=" , , " data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code=" " data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code="{RH-LH}" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code="<[-].> {-} <>" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code=" ,{ - }" data-init-name-dict="{1: 'Voice', '2-3': 'Piano'}" data-read-only="1"></div>

<a href="/images/conductor-music-score-sample.png" target="_blank">
	{% img figure /images/conductor-music-score-sample.png 480 '"" "conductor music score sample"' %}
</a>

<div class="vue-component staff-layout-viewer" data-init-code="<[fl-cl]-bcl-asx-tsx-tr> <[vl1-vl2]-viola-[cello1-cello2]-cb> {p1-p2}" data-init-name-dict="{fl: 'Flute 1', cl: 'Clarinet 1', bcl:'Bass Clarinet', asx: 'Alto Saxophone', tsx: 'Tenor Saxophone', tr: 'Trumpet', vl1: 'Violin 1', vl2: 'Violin 2', viola: 'Viola', cello1: 'Cello 1', cello2: 'Cello 2', cb: 'Contrabass', 'p1-p2': 'Piano'}" data-scale="0.7" data-read-only="1"></div>

<div class="vue-component staff-layout-viewer" data-init-code="{-}{-}" data-init-name-dict="{'1-2': 'Piano I', '3-4': 'Piano II'}"></div>



<script src="/vue/chunk-vendors.js"></script>
<script src="/vue/staff-layout-viewer.js"></script>
