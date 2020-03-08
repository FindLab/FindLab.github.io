<template>
	<div>
		<MidiRoll :player="player" :timeScale="timeScale"
			:width="width" :height="height"
		/>
		<p>
			<span class="section">N: <em class="N">{{N}}</em> <input type="range" v-model="N" min="1" max="10" step="1" /></span>
			<span class="section">pitches: <em><span v-for="p of pitches" :key="p">{{p}}, </span></em></span>
		</p>
		<p>
			mask: <span class="mask">{{mask}}</span>
		</p>
	</div>
</template>

<script>
	import {MidiRoll} from "@k-l-lambda/web-widgets";



	const CUT_INTERVAL = 120;



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
				N: 5,
				cutTime: 0,
				pitches: [],
			};
		},


		computed: {
			keyRange () {
				if (!this.notation || !this.notation.notes)
					return null;

				if (this.notation.keyRange)
					return this.notation.keyRange;

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
					progressTime: this.cutTime,
					turnCursor () {},
				};
			},


			mask () {
				return Array(88).fill().map((_, i) => i + 21).map(pitch => this.pitches.includes(pitch) ? "1" : "_").join("");
			},
		},


		created () {
			if (this.notation && this.notation.notes)
				this.notation.notes.forEach((note, i) => note.index = i);

			this.updateN();
		},


		mounted () {
			this.width = this.$el.clientWidth;
			window.addEventListener("resize", () => this.width = this.$el.clientWidth);

			//console.log("MidiAudio:", MidiAudio);
		},


		methods: {
			async updateN () {
				let lastTime = 0;
				const pitches = new Set();

				for (const note of this.notation.notes) {
					if (note.index >= 10 || pitches.size >= this.N && note.start - lastTime > CUT_INTERVAL) {
						this.pitches = Array.from(pitches).sort();
						this.cutTime = lastTime + CUT_INTERVAL;

						break;
					}

					pitches.add(note.pitch);

					lastTime = note.start;
				}

				await this.$nextTick();

				this.notation.notes.forEach(note => note.on = note.start < this.cutTime);
			},
		},


		watch: {
			N: "updateN",
		},
	};
</script>

<style scoped>
	p
	{
		white-space: nowrap;
	}

	p .N
	{
		display: inline-block;
		width: 1em;
	}

	.mask
	{
		font-size: 9px;
	}

	p .section
	{
		display: inline-block;
	}

	p .section + .section
	{
		margin-left: 2em;
	}
</style>
