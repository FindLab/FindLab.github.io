<template>
	<div class="staff-layout-viewer"
		:class="{readonly: readOnly}"
	>
		<header class="control">
			code:<input type="text" class="code" v-if="!readOnly" v-model="code" placeholder="staff layout code" :disabled="readOnly" />
			<strong class="code" v-if="readOnly" v-text="code"></strong>
			<input type="text" class="mask" v-if="showMask" v-model.lazy="binaryMask" placeholder="staff mask code" />
		</header>
		<main>
			<div class="error" v-if="error">
				{{error}}
			</div>
			<svg class="graph" v-if="layout" width="400" :viewBox="viewbox">
				<defs>
					<g id="staff">
						<line v-for="l in 5" :key="l" class="staff-line"
							:x1="0"
							:x2="16"
							:y1="l - 3"
							:y2="l - 3"
						/>
						<line class="measure-bar"
							:x1="12"
							:x2="12"
							:y1="-2"
							:y2="2"
						/>
					</g>
				</defs>
				<g class="system" transform="translate(-2, 4)">
					<line class="head-connection" v-if="maskedLayout.staffIds.length > 1"
						:x1="0"
						:x2="0"
						:y1="0"
						:y2="(maskedLayout.staffIds.length - 1) * 10 + 4"
					/>
					<g class="staff" v-for="(id, i) of maskedLayout.staffIds" :key="id"
						:transform="`translate(0, ${i * 10 + 2})`"
					>
						<use xlink:href="#staff" />
					</g>
					<g class="annotation">
						<g class="staff" v-for="(id, i) of maskedLayout.staffIds" :key="id"
							:transform="`translate(17, ${i * 10 + 2})`"
						>
							<text class="staff-id" y="0.6"
							>
								{{id}}
								<title>{{id}}</title>
							</text>
						</g>
						<g v-if="showAnnotation"
							transform="translate(-6, 0)"
						>
							<g class="conjunction" v-for="(conjunction, i) of maskedLayout.conjunctions" :key="i"
								:transform="`translate(0, ${i * 10 + 7})`"
							>
								<text class="vertical">{{",.-"[conjunction]}}</text>
							</g>
							<g class="bound" v-for="(bound, i) of maskedLayout.bounds" :key="`b${i}`"
								:transform="`translate(0, ${i * 10 + 2})`"
							>
								<text class="vertical" v-if="bound[0]" x="-3.6">{{bound[0]}}</text>
								<text class="vertical" v-if="bound[1]" x="2.2">{{bound[1]}}</text>
							</g>
						</g>
					</g>
					<g>
						<g class="conjunction" v-for="(conjunction, i) of maskedLayout.conjunctions" :key="i">
							<line class="measure-bar" v-show="conjunction > 0"
								:class="{dashed: conjunction === 1}"
								:x1="12"
								:x2="12"
								:y1="i * 10 + 4"
								:y2="(i + 1) * 10"
							/>
						</g>
					</g>
					<StaffBrackets ref="brackets"
						:layout="maskedLayout"
						:positions="positions"
						:nameDict="nameDict"
					/>
				</g>
			</svg>
			<table class="group-names" v-if="layout">
				<tr v-for="g of layout.groups" :key="g.key"
					:class="{disabled: isGroupDisabled(g)}"
					v-show="!readOnly || nameDict[g.key]"
				>
					<th>
						{{g.key}}:
						<!--span v-if="g.group.grand">*</span-->
					</th>
					<td>
						<input type="text" v-model="nameDict[g.key]" :disabled="readOnly" />
					</td>
				</tr>
			</table>
			<div class="export">
				Encode as: <ul>
					<li v-for="lang of langs" :key="lang" v-text="lang"
						:class="{chosen: exportLang === lang}"
						@click="exportLang = exportLang === lang ? null : lang"
					></li>
				</ul>
				<textarea v-if="exportLang" :value="exportCode" readonly="readonly" @click="$event.target.select()"></textarea>
			</div>
		</main>
	</div>
</template>

<script>
	import {debounce} from "lodash";

	import StaffBrackets from "./staff-brackets.vue";

	import * as staffLayout from "../staffLayout";



	export default {
		name: "staff-layout-viewer",


		components: {
			StaffBrackets,
		},


		props: {
			initCode: String,
			initNameDict: String,
			readOnly: Boolean,
			showMask: Boolean,
			showAnnotation: Boolean,
			scale: {
				type: Number,
				default: 1,
			},
		},


		data () {
			return {
				code: this.initCode || "",
				layout: null,
				mask: 0,
				error: null,
				nameDict: this.initNameDict ? eval(`(${this.initNameDict})`) : {},
				exportLang: null,
				langs: ["Lilypond", "MusicXML"],
			};
		},


		computed: {
			stavesCount () {
				if (!this.layout)
					return null;

				return this.layout.stavesCount;
			},


			viewbox () {
				if (!this.layout)
					return null;

				return `${-20 / this.scale} 0 ${40 / this.scale} ${this.stavesCount * 10 + 2}`;
			},


			positions () {
				if (!this.stavesCount)
					return null;

				return Array(this.maskedLayout.staffIds.length).fill(null).map((_, i) => ({
					y: i * 10 + 2,
					radius: 2,
				}));
			},


			binaryMask: {
				get () {
					const code = this.mask.toString(2);
					const pad = (code.length < this.stavesCount ? "0".repeat(this.stavesCount - code.length) : "") + code;
					return pad.split("").reverse().join("");
				},

				set (value) {
					const reversed = value.split("").reverse().join("");
					this.mask = parseInt(reversed, 2);
				},
			},


			maskedLayout () {
				return this.layout && this.layout.mask(this.mask);
			},


			exportCode () {
				if (!this.layout || !this.exportLang)
					return "";

				return staffLayout.encode(this.exportLang, this.layout, this.nameDict);
			},
		},


		created () {
			this.updateLayout();
			console.log("v:", this);
		},


		methods: {
			async updateLayout () {
				this.layout = null;
				this.error = null;
				this.mask = 0;

				try {
					this.layout = await staffLayout.parseCode(this.code);
					this.mask = 2 ** this.layout.stavesCount - 1;
				}
				catch (err) {
					this.error = err;
				}
			},


			isGroupDisabled (group) {
				return !Array(group.range[1] + 1 - group.range[0]).fill(null).some((_, i) => this.mask & (1 << (group.range[0] + i)));
			},
		},


		watch: {
			code: debounce(function () {
				this.updateLayout();
			}, 600),
		},
	};
</script>

<style lang="scss" scoped>
	.staff-layout-viewer
	{
		border: 1px solid #ccc;
		margin: 2em;

		& > header
		{
			text-align: center;
			padding: 1em;

			.code
			{
				margin-left: 1em;
				width: 20em;
				font-weight: bold;
			}
		}
	}

	.readonly
	{
		input
		{
			border: 0;
		}
	}

	main
	{
		text-align: center;
		white-space: nowrap;

		.error
		{
			color: #a00;
		}

		.error, .graph, .group-names
		{
			display: inline-block;
			vertical-align: top;
		}
	}

	.graph
	{
		line
		{
			stroke: currentColor;
		}

		.staff-line
		{
			stroke-width: 0.1;
		}

		.measure-bar
		{
			stroke-width: 0.1;

			&.dashed
			{
				stroke-dasharray: 0.3 0.3;
			}
		}

		.head-connection
		{
			stroke-width: 0.1;
		}

		.annotation
		{
			text
			{
				font-size: 2.4px;
				fill: steelblue;

				&.vertical
				{
					transform: rotate(90deg);
				}
			}

			.bound
			{
				text
				{
					font-size: 2px;
				}
			}
		}
	}

	.group-names
	{
		margin-left: 2em;
		width: unset;

		tr.disabled
		{
			color: #ccc;

			input
			{
				color: #ccc;
			}
		}

		td
		{
			input
			{
				width: 10em;
			}
		}

		th, td
		{
			border: 0;
		}
	}

	.export
	{
		padding: 1em;
		text-align: left;

		ul
		{
			display: block;
			padding: 0;

			li
			{
				display: inline-block;
				margin: 0 .5em;
				padding: .4em;
				background: #eee;
				cursor: pointer;
				text-decoration: underline;

				&:hover
				{
					outline: solid 2px #777;
				}

				&.chosen
				{
					font-weight: bold;
				}
			}
		}

		textarea
		{
			width: 48em;
			height: 12em;
		}
	}
</style>
