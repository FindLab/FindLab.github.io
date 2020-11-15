\version "2.20.0" 

\language "english" 

\header {
	tagline = ""
}

\include "lotus.ly"


#(set-global-staff-size 32) 

\paper {
	paper-width = 22\cm
	paper-height = 4\cm
	ragged-last = ##t
}


\score {
	\relative g' {
		\lotusRepeatABA {
			{
				e4 e d c
				e d c2
			} \mark \markup {\bold \large {Fine} }
			\bar "|."
			g'4 c a g e1 ^\markup {\bold \large {D. C. al Fine} }
		}

		\bar "||"
	}
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 120
	}
	
}


% i: <[1, 2], 3, 4>
% s: <2 2>
