<template>
	<div>
		<MIDIPlayer :url="midiUrl"
			@midi="onMidi"
			@reset="onReset"
		/>
		<div class="plots">
			<VeHistogram class="stat playing"
				:data="playingData"
				:settings="statSetting"
				:legendVisible="false"
			/>
		</div>
	</div>
</template>

<script>
	import {VeHistogram} from "v-charts";

	import MIDIPlayer from "./midi-player.vue";



	export default {
		name: "midi-pitches-mask",


		components: {
			MIDIPlayer,
			VeHistogram,
		},


		props: {
			midiUrl: String,
		},


		data () {
			return {
				playingStat: Array(88).fill().map((_, i) => ({pitch: i + 21, count: 0})),
			};
		},


		computed: {
			playingData () {
				return {
					columns: ["pitch", "count"],
					rows: this.playingStat,
				};
			},


			statSetting () {
				return {
					metrics: ["count"],
					dimension: ["pitch"],
					xAxisName: "pitch",
					yAxisName: ["count"],
				};
			},
		},


		methods: {
			onMidi (event) {
				if (event.subtype === "noteOn") {
					//console.log("midi:", event.noteNumber);
					const item = this.playingStat.find(i => i.pitch === event.noteNumber);
					if (item)
						++item.count;
				}
			},


			onReset () {
				this.playingStat.forEach(i => i.count = 0);
			},
		},
	};
</script>
