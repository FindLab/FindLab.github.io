<template>
	<component v-if="sourceData" :is="`Ve${sourceData && sourceData.type || type}`"
		:data="sourceData.data"
		:settings="sourceData.settings"
		:width="sourceData.width"
		:height="sourceData.height"
		:beforeConfig="sourceData.beforeConfig"
		:afterConfig="sourceData.afterConfig"
		:afterSetOption="sourceData.afterSetOption"
		:afterSetOptionOnce="sourceData.afterSetOptionOnce"
		:events="sourceData.events"
		:grid="sourceData.grid"
		:colors="sourceData.colors"
		:tooltipVisible="sourceData.tooltipVisible"
		:legendVisible="sourceData.legendVisible"
		:legendPosition="sourceData.legendPosition"
		:markLine="sourceData.markLine"
		:markArea="sourceData.markArea"
		:markPoint="sourceData.markPoint"
		:visualMap="sourceData.visualMap"
		:dataZoom="sourceData.dataZoom"
		:toolbox="sourceData.toolbox"
		:initOptions="sourceData.initOptions"
		:title="sourceData.title"
		:legend="sourceData.legend"
		:xAxis="sourceData.xAxis"
		:yAxis="sourceData.yAxis"
		:radar="sourceData.radar"
		:tooltip="sourceData.tooltip"
		:axisPointer="sourceData.axisPointer"
		:brush="sourceData.brush"
		:geo="sourceData.geo"
		:timeline="sourceData.timeline"
		:graphic="sourceData.graphic"
		:series="sourceData.series"
		:backgroundColor="sourceData.backgroundColor"
		:textStyle="sourceData.textStyle"
		:animation="sourceData.animation"
		:theme="sourceData.theme"
		:themeName="sourceData.themeName"
		:loading="sourceData.loading"
		:dataEmpty="sourceData.dataEmpty"
		:extend="sourceData.extend"
		:judgeWidth="sourceData.judgeWidth"
		:widthChangeDelay="sourceData.widthChangeDelay"
		:tooltipFormatter="sourceData.tooltipFormatter"
		:resizeable="sourceData.resizeable"
		:resizeDelay="sourceData.resizeDelay"
		:changeDelay="sourceData.changeDelay"
		:setOptionOpts="sourceData.setOptionOpts"
		:cancelResizeCheck="sourceData.cancelResizeCheck"
		:notSetUnchange="sourceData.notSetUnchange"
		:log="sourceData.log"
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
