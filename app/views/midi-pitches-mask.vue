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
		<div class="plots">
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
			sourceList: String,
		},


		data () {
			return {
				chosenURL: null,
				playingStat: Array(88).fill().map((_, i) => ({
					pitch: i + 21,
					count: 0,
					//name: `${NOTE_NAMES[(i + 21) % 12]}${Math.floor((i + 9) / 12)}`,
				})),
			};
		},


		computed: {
			sourceUrls () {
				const list = document.querySelector(this.sourceList);
				if (list)
					return [...list.options].map(option => option.value);

				return null;
			},
		},


		mounted () {
			if (this.sourceUrls)
				this.chosenURL = this.sourceUrls[0];
		},


		methods: {
			normalizeMidiName (path) {
				return path.replace(/.*\/([^/]+)\.mid$/, "$1").replace(/_/g, " ");
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
