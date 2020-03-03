<template>
	<component v-if="sourceData" :is="`Ve${sourceData && sourceData.type || type}`"
		:data="sourceData.data"
		:markLine="sourceData.markLine"
		:settings="sourceData.settings"
		:grid="sourceData.grid"
	/>
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


		async created () {
			const json = await (await fetch(this.source)).json();

			if (json._preprocess) {
				if (json._preprocess.singleField) {
					const field = json._preprocess.singleField;

					json.data = {
						columns: ["index", field],
						rows: json._preprocess.metaData.map((value, index) => ({[field]: value, index})),
					};
				}
			}

			this.sourceData = json;
		},
	};
</script>
