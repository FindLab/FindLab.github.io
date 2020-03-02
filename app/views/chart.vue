<template>
	<component v-if="sourceData" :is="`Ve${type}`" :data="chartData" :settings="chartSettings" />
</template>

<script>
	import _ from "lodash";
	import * as vcharts from "v-charts";



	const componentNames = Object.keys(vcharts).filter(key => /^Ve/.test(key));



	export default {
		name: "chart",


		props: {
			type: {
				type: String,
				default: "Histogram",
			},
			source: String,
		},


		components: {
			..._.pick(vcharts, componentNames),
		},


		data () {
			return {
				sourceData: null,
			};
		},


		computed: {
			chartData () {
				return this.sourceData && this.sourceData.data;
			},


			chartSettings () {
				return this.sourceData && this.sourceData.settings;
			},
		},


		async created () {
			const json = await (await fetch(this.source)).json();

			if (json._preprocess) {
				if (json._preprocess.singleField) {
					const field = json._preprocess.singleField;

					json.data = {
						columns: ["index", field],
						rows: json.data.map((value, index) => ({[field]: value, index})),
					};
				}
			}

			this.sourceData = json;
		},
	};
</script>
