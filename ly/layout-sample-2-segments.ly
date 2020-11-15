\version "2.20.0" 

\language "english" 

\header {
	tagline = ""
}


#(set-global-staff-size 32) 

\paper {
	paper-width = 28\cm
	paper-height = 4\cm
	system-system-spacing.basic-distance = #16
	top-markup-spacing.basic-distance = #12
	ragged-last = ##t
}


\score {
	\relative c' {
		c1 e g c \bar "||"
		c,4 d e f g a b c
		b a g f e d c \bar "|."
	}
	
	\layout {
		indent = #0
	}
}


% i: [1, 2, 3, 4], [5, 6, 7, 8]
% i: [1..4], [5..8]
% s: 4 4
