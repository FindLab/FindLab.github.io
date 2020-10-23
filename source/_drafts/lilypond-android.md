---
author: k-l-lambda
coauthor: k-l-lambda
title: We ported Lilypond to Android
tags:
  - sheet music
  - lilypond
---


{% youtube ay13Dk6D60M %}
<figure>
<figcaption>The Android porting of Lilypond has been done by us, you're welcome.</figcaption>
</figure>


As a sheet music program, [Lilypond](https://lilypond.org/) is high-quality and sophisticated, but not as modern as its several competitors,
such as [Verovio](https://www.verovio.org/index.xhtml) and [OSMD](https://opensheetmusicdisplay.org/).
For nowadays, let's consider a good sheet music engine:
working with HTML5 facilitates animating features development, and mobile devices are the best choice for instruments playing assistance.
Yes, serving requests online is an option, but the service is inevitably expensive and slow.
Computing on the device is still the best practice.

This attempt is a start. We demonstrated that porting Lilypond to Android can be got through.
Certainly it can be implemented in a neater, official way.
For future, we are considering these issues:

* Porting Lilypond to iOS.

* Accelerating Lilypond engraving, possibly by accelerating its Scheme virtual machine.
  If this can be done, it will improve Lilypond's competitivity greatly.

* Can we manipulate graph music elements from an intermediate representation,
  so that avoid re-parsing ly code every time for trivial change?
  Also possibly we can implement an HTML5 renderer for this intermediate format.

This is our [forked repository of Lilypond](https://gitlab.com/k.l.lambda/lilypond).
Welcome to disucss technical details here.
