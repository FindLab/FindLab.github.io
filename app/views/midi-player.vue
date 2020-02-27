<template>
	<div>
		<MidiRoll :midiURL="url" :timeScale="timeScale" />
	</div>
</template>

<script>
	import {MidiRoll} from "@k-l-lambda/web-widgets";



	export default {
		name: "midi-player",


		props: {
			url: String,
			timeScale: {
				type: Number,
				default: 2e-3,
			},
		},


		components: {
			MidiRoll,
		},


		/*mounted () {
			console.log("midi-player:", this.url);
		},*/
	};
</script>
