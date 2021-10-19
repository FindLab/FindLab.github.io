<template>
	<g class="staff-brackets">
		<g class="group" v-for="bracket of brackets" :key="bracket.key"
			:transform="`translate(${bracket.level * -1.2}, 0)`"
		>
			<g class="bracket" v-if="bracket.type === 2">
				<rect
					:x="-1.2"
					:y="bracket.top"
					:width="0.45"
					:height="bracket.bottom - bracket.top"
				/>
				<g
					:transform="`translate(-1.2, ${bracket.top - 0.21})`"
				>
					<path transform="scale(0.0040, -0.0040)" d="M0 -56v91c0 12 10 21 22 21h43c164 0 281 136 377 272c10 14 32 -1 22 -15c-103 -145 -222 -369 -399 -369h-65z" />
				</g>
				<g
					:transform="`translate(-1.2, ${bracket.bottom + 0.21})`"
				>
					<path transform="scale(0.0040, -0.0040)" d="M0 56h65c177 0 296 -224 399 -369c10 -14 -12 -29 -22 -15c-96 136 -213 272 -377 272h-43c-12 0 -22 9 -22 21v91z" />
				</g>
			</g>
			<g class="square" v-if="bracket.type === 3">
				<line :x1="-0.9" :x2="-0.9" :y1="bracket.top" :y2="bracket.bottom" stroke-width="0.1" />
				<line :x1="-0.9" :x2="0" :y1="bracket.top" :y2="bracket.top" stroke-width="0.1" />
				<line :x1="-0.9" :x2="0" :y1="bracket.bottom" :y2="bracket.bottom" stroke-width="0.1" />
			</g>
			<g class="brace" v-if="bracket.type === 1"
				:transform="`translate(-0.2, ${(bracket.top + bracket.bottom) / 2})`"
			>
				<path :transform="`scale(0.0040, ${-0.0040 * (bracket.bottom - bracket.top) / 15.1825})`" d="M-208 -1336c0 312 124 616 124 912c0 156 -36 300 -144 416c0 4 -4 4 -4 8s4 4 4 8c108 116 144 260 144 416c0 296 -124 600 -124 912c0 212 52 420 196 576c16 16 40 -8 24 -24c-108 -120 -144 -264 -144 -420c0 -292 116 -588 116 -896c0 -212 -48 -416 -188 -572c140 -156 188 -360 188 -572c0 -308 -116 -604 -116 -896c0 -156 36 -300 144 -420c16 -16 -8 -40 -24 -24c-144 156 -196 364 -196 576z" />
			</g>
			<g class="name" v-if="bracket.name"
				:transform="`translate(-4, ${(bracket.top + bracket.bottom) / 2 + 1})`"
			>
				<text>{{bracket.name}}</text>
			</g>
		</g>
	</g>
</template>

<script>
	export default {
		name: "staff-brackets",


		props: {
			layout: Object,
			positions: Array,
			nameDict: {
				type: Object,
				default: () => ({}),
			},
		},


		computed: {
			brackets () {
				return this.layout.groups.map(g => {
					const positionTop = this.positions[g.range[0]];
					const positionBottom = this.positions[g.range[1]];

					return {
						key: g.key,
						type: g.group.type,
						level: g.group.level || 0,
						top: positionTop.y - positionTop.radius,
						bottom: positionBottom.y + positionBottom.radius,
						name: this.nameDict[g.key],
					};
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	rect, path
	{
		fill: currentColor;
	}

	line
	{
		stroke: currentColor;
	}

	.name
	{
		text
		{
			text-anchor: end;
			font-size: 2.4px;
		}
	}
</style>
