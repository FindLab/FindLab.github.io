<template>
	<div class="midi-player">
		<MidiRoll :player="player" :timeScale="timeScale"
			:width="width" :height="height"
		/>
		<div v-if="player" class="controls">
			<div>
				<button v-show="player.progressTime > 0" @click="onReset">&#x23ee;</button>
				<button v-show="!player.isPlaying" @click="onPlay">&#x25b6;</button>
				<button v-show="player.isPlaying" @click="player.pause()">&#x23f8;</button>
			</div>
		</div>
	</div>
</template>

<script>
	import {MidiRoll, MIDI, MidiPlayer, MidiAudio} from "@k-l-lambda/web-widgets";



	const msDelay = ms => new Promise(resolve => setTimeout(resolve, ms));



	export default {
		name: "midi-player",


		props: {
			url: String,
			timeScale: {
				type: Number,
				default: 4e-3,
			},
			height: {
				type: Number,
				default: 180,
			},
		},


		components: {
			MidiRoll,
		},


		data () {
			return {
				player: null,
				width: 600,
			};
		},


		async created () {
			const buffer = await (await fetch(this.url)).arrayBuffer();
			const midi = MIDI.parseMidiData(buffer);

			this.player = new MidiPlayer(midi, {
				onMidi: (data, timestamp) => this.onMidi(data, timestamp),
				onPlayFinish: () => this.onFinish(),
			});
		},


		mounted () {
			this.width = this.$el.clientWidth;
			window.addEventListener("resize", () => this.width = this.$el.clientWidth);
		},


		methods: {
			async onMidi (data, timestamp) {
				if (!MidiAudio.WebAudio.empty()) {
					switch (data.subtype) {
					case "noteOn":
						MidiAudio.noteOn(data.channel, data.noteNumber, data.velocity, timestamp);

						break;
					case "noteOff":
						MidiAudio.noteOff(data.channel, data.noteNumber, timestamp);

						break;
					}
				}

				const delay = timestamp - performance.now();
				if (delay > 0)
					await msDelay(delay);

				if (this.player && this.player.isPlaying)
					this.$emit("midi", data);
			},


			onFinish () {
				//if (this.player)
				//	this.player.turnCursor(0);

				this.$emit("finish");
			},


			onReset () {
				if (this.player) {
					this.player.turnCursor(0);
					this.player.pause();

					this.$emit("reset");
				}
			},


			onPlay () {
				this.$emit("play", this.player.progressTime);

				this.player.play();
			},
		},
	};
</script>

<style scoped>
	.midi-player
	{
		position: relative;
		overflow: hidden;
	}

	.controls
	{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: opacity .3s;
		opacity: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: #0001;
	}

	.controls:hover
	{
		opacity: 1;
	}

	.controls button
	{
		font-size: 30px;
		width: 60px;
		background: #fffc;
		border: 0;
		outline: 0;
		border-radius: 50%;
		cursor: pointer;
		padding: 10px;
		justify-content: center;
		box-shadow: 0 0 16px black;
		margin: 0 1em;
	}
</style>
