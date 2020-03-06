<template>
	<div>
		<MidiRoll :player="player" :timeScale="timeScale"
			:width="width" :height="height"
		/>
	</div>
</template>

<script>
	import {MidiRoll} from "@k-l-lambda/web-widgets";



	export default {
		name: "midi-head-mask",


		props: {
			notation: Object,
			height: {
				type: Number,
				default: 200,
			},
			timeScale: {
				type: Number,
				default: 0.08,
			},
		},


		components: {
			MidiRoll,
		},


		data () {
			return {
				width: 600,
			};
		},


		computed: {
			keyRange () {
				if (!this.notation || !this.notation.notes)
					return null;

				const pitches = this.notation.notes.map(note => note.pitch);

				return {
					high: Math.max(...pitches),
					low: Math.min(...pitches),
				};
			},


			endTime () {
				if (!this.notation || !this.notation.notes)
					return 0;

				const times = this.notation.notes.map(note => note.start + note.duration);

				return Math.max(...times);
			},


			player () {
				return {
					notations: {
						notes: this.notation.notes,
						keyRange: this.keyRange,
						bars: [],
						endTime: this.endTime,
					},
					progressTime: 0,
					turnCursor () {},
				};
			},
		},


		created () {
		},


		mounted () {
			this.width = this.$el.clientWidth;
			window.addEventListener("resize", () => this.width = this.$el.clientWidth);

			//console.log("MidiAudio:", MidiAudio);
		},
	};
</script>

<style scoped>
</style>
