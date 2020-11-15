\version "2.20.0" 

\language "english" 

\header {
	tagline = ""
}

\include "lotus.ly"


#(set-global-staff-size 28) 

\paper {
	paper-width = 24\cm
	paper-height = 12\cm
	ragged-last = ##t
}


\score {
	\relative g' {
		g4 e e r
		f d d r
		c d e f
		g g g r
		\lotusRepeatABA {
			{
				\mark \markup { \musicglyph #"scripts.segno" }
				g e e r
				f d d r
				\mark \markup {\musicglyph #"scripts.coda"}
			} |
			c e g g
			e1
			d4 d d d
			d e f r
			e e e e
			e f g r
			_\markup {\bold \large {D. S. al Coda} }
			\bar "||" |
		}
		\mark \markup{\musicglyph #"scripts.coda"}
		c, e g g
		c,1
		\bar "|."
	}
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 120
	}
	
}


% i: 1..4, <[5, 6], 7..12>, 13, 14
% s: 4 <2 6> 2
