<template>
	<div>
		<MIDIPlayer :url="midiUrl"
			@midi="onMidi"
			@reset="onReset"
			@play="onPlay"
		/>
		<div class="plots">
			<VeHistogram class="stat playing"
				:data="playingData"
				:settings="statSetting"
				:legendVisible="false"
				:grid="{left: 30}"
			/>
		</div>
	</div>
</template>

<script>
	import {VeHistogram} from "v-charts";

	import MIDIPlayer from "./midi-player.vue";



	const NOTE_NAMES = [
		"C", "#C", "D", "#D", "E", "F", "#F", "G", "#G", "A", "#A", "B",
	];



	export default {
		name: "midi-pitches-counter",


		components: {
			MIDIPlayer,
			VeHistogram,
		},


		props: {
			midiUrl: String,
		},


		data () {
			return {
				playingStat: Array(88).fill().map((_, i) => ({
					pitch: i + 21,
					frequency: 0,
					name: `${NOTE_NAMES[(i + 21) % 12]}${Math.floor((i + 9) / 12)}`,
				})),
			};
		},


		computed: {
			playingData () {
				return {
					columns: ["pitch", "frequency", "name"],
					rows: this.playingStat,
				};
			},


			statSetting () {
				return {
					metrics: ["frequency"],
					dimension: ["name"],
					xAxisName: "pitch",
					yAxisName: ["frequency"],
				};
			},
		},


		methods: {
			onMidi (event) {
				if (event.subtype === "noteOn") {
					//console.log("midi:", event.noteNumber);
					const item = this.playingStat.find(i => i.pitch === event.noteNumber);
					if (item)
						++item.frequency;
				}
			},


			onReset () {
				this.playingStat.forEach(i => i.frequency = 0);
			},


			onPlay (progress) {
				if (progress === 0)
					this.playingStat.forEach(i => i.frequency = 0);
			},
		},
	};
</script>
