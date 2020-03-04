<template>
	<div>
		<p>
			Choose an input song:
			<select v-if="sourceUrls" v-model="chosenURL">
				<option v-for="url of sourceUrls" :key="url" :value="url">{{normalizeMidiName(url)}}</option>
			</select>
		</p>
		<MIDIPlayer v-if="chosenURL"
			:url="chosenURL"
			@midi="onMidi"
			@reset="onReset"
			@play="onPlay"
		/>
		<div class="plots" v-if="pitchColumns">
			<div v-for="(column, i) of pitchColumns" :key="i">
				<VeHistogram
					:series="columnToSeries(column)"
					:width="plotCommon.width"
					:height="plotCommon.height"
					:xAxis="plotCommon.xAxis"
					:yAxis="plotCommon.yAxis"
					:grid="plotCommon.grid"
				/>
				<label>{{normalizeMidiName(sourceUrls[i])}}</label>
			</div>
		</div>
	</div>
</template>

<script>
	import {VeHistogram} from "v-charts";
	import {MIDI} from "@k-l-lambda/web-widgets";

	import MIDIPlayer from "./midi-player.vue";



	const countMidiPitches = midi => [].concat(...midi.tracks)
		.filter(event => event.subtype === "noteOn")
		.reduce((cc, event) => {
			++cc[event.noteNumber - 21];

			return cc;
		}, Array(88).fill(0));


	const PITCH_THRESHOLDS = [4, 8, 14, 27];
	const roundPitchCount = count => {
		for (const threshold of PITCH_THRESHOLDS.reverse()) {
			if (count >= threshold)
				return threshold;
		}

		return 0;
	};



	export default {
		name: "midi-pitches-mask",


		components: {
			MIDIPlayer,
			VeHistogram,
		},


		props: {
			sourceList: String,
		},


		data () {
			return {
				chosenURL: null,
				playingStat: Array(88).fill().map((_, i) => ({
					pitch: i + 21,
					count: 0,
				})),
				pitchColumns: null,
			};
		},


		computed: {
			sourceUrls () {
				const list = document.querySelector(this.sourceList);
				if (list)
					return [...list.options].map(option => option.value);

				return null;
			},


			plotCommon () {
				return {
					height: "120px",
					xAxis: {
						name: "pitch",
						type: "category",
						data: Array(88).fill().map((_, i) => i + 21),
					},
					yAxis: {
						name: "count",
						type: "value",
					},
					grid: {
						top: 16,
						bottom: 0,
					},
				};
			},
		},


		async created () {
			if (this.sourceUrls) {
				this.chosenURL = this.sourceUrls[0];

				const buffers = await Promise.all(this.sourceUrls.map(async (url) => await (await fetch(url)).arrayBuffer()));
				this.pitchColumns = buffers.map(MIDI.parseMidiData).map(countMidiPitches).map(columns => columns.map(roundPitchCount));
			}
		},


		methods: {
			normalizeMidiName (path) {
				return path.replace(/.*\/([^/]+)\.mid$/, "$1").replace(/_/g, " ");
			},


			columnToSeries (column) {
				return {
					name: "count",
					data: column,
					type: "bar",
				};
			},


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


			onPlay (progress) {
				if (progress === 0)
					this.playingStat.forEach(i => i.count = 0);
			},
		},
	};
</script>

<style scoped>
	.plots > *
	{
		display: inline-block;
		width: 50%;
		text-align: center;
	}
</style>
