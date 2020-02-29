
import {MidiAudio} from "@k-l-lambda/web-widgets";



MidiAudio.loadPlugin({soundfontUrl: "/soundfont/", api: "webaudio"})
	.then(() => console.log("Soundfont loaded."));
