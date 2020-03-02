<template>
	<component :is="`Ve${type}`" :data="chartData" :settings="chartSettings" />
</template>

<script>
	import _ from "lodash";
	import * as vcharts from "v-charts";
	//console.log("vcharts:", vcharts);



	const componentNames = Object.keys(vcharts).filter(key => /^Ve/.test(key));



	export default {
		name: "chart",


		props: {
			type: {
				type: String,
				default: "Histogram",
			},
		},


		components: {
			..._.pick(vcharts, componentNames),
		},


		computed: {
			chartData () {
				return {
					columns: ["date", "cost", "profit", "growthRate", "people"],
					rows: [
						{cost: 1523, date: "01/01", profit: 1523, growthRate: 0.12, people: 100},
						{cost: 1223, date: "01/02", profit: 1523, growthRate: 0.345, people: 100},
						{cost: 2123, date: "01/03", profit: 1523, growthRate: 0.7, people: 100},
						{cost: 4123, date: "01/04", profit: 1523, growthRate: 0.31, people: 100},
					],
				};
			},


			chartSettings () {
				return undefined;
			},
		},
	};
</script>
