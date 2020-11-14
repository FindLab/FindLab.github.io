\version "2.20.0" 

\language "english" 

\header {
	tagline = ""
}


#(set-global-staff-size 32) 

\paper {
	paper-width = 16\cm
	paper-height = 4\cm
	system-system-spacing.basic-distance = #16
	top-markup-spacing.basic-distance = #12
	ragged-last = ##t
}


\score {
	\relative c' {
		\repeat volta 2 {
			c2 e g e
		}
		\alternative {
			d1
			c1
		}
		\bar "|."
	}
	
	\layout {
		indent = #0
	}
	
}


% i: 2*[1, 2]{3, 4}
% s: 2*[2]{1 1}
