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
		<div class="plots" v-if="pitchSeries">
			<div v-for="(series, i) of pitchSeries" :key="i">
				<VeHistogram
					:series="series"
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
	import Vue from "vue";

	import {VeHistogram} from "v-charts";
	import {MIDI} from "@k-l-lambda/web-widgets";

	import MIDIPlayer from "./midi-player.vue";



	const countMidiPitches = midi => [].concat(...midi.tracks)
		.filter(event => event.subtype === "noteOn")
		.reduce((cc, event) => {
			++cc[event.noteNumber - 21];

			return cc;
		}, Array(88).fill(0));


	const PITCH_THRESHOLDS = [27, 14, 8, 4];
	const roundPitchCount = count => {
		for (const threshold of PITCH_THRESHOLDS) {
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
				playingColumns: Array(88).fill(0),
				roundPlayingColumns: Array(88).fill(0),
				pitchSeries: null,
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
				const pitchColumns = buffers.map(MIDI.parseMidiData).map(countMidiPitches).map(columns => columns.map(roundPitchCount));
				this.pitchSeries = pitchColumns.map(column => this.columnToSeries(column));

				//console.log("pitchSeries:", this.pitchSeries);
			}
		},


		methods: {
			normalizeMidiName (path) {
				return path.replace(/.*\/([^/]+)\.mid$/, "$1").replace(/_/g, " ");
			},


			columnToSeries (column) {
				return [
					{
						name: "playing",
						data: this.playingColumns,
						type: "bar",
						barGap: -1,
						barCategoryGap: 0,
					},
					{
						name: "playing coarse",
						data: this.roundPlayingColumns,
						type: "bar",
						itemStyle: {color: "red"},
					},
					{
						name: "candidate",
						data: column,
						type: "bar",
					},
				];
			},


			onMidi (event) {
				if (event.subtype === "noteOn") {
					//console.log("midi:", event.noteNumber);
					//++this.playingColumns[event.noteNumber - 21];
					const i = event.noteNumber - 21;
					Vue.set(this.playingColumns, i, this.playingColumns[i] + 1);
					Vue.set(this.roundPlayingColumns, i, roundPitchCount(this.playingColumns[i]));
				}
			},


			onReset () {
				for (let i = 0; i < this.playingColumns.length; ++i) {
					this.playingColumns[i] = 0;
					this.roundPlayingColumns[i] = 0;
				}
			},


			onPlay (progress) {
				if (progress === 0)
					this.onReset();
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
