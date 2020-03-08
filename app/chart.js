
import Vue from "vue";
import App from "./views/chart.vue";



for (const elem of document.querySelectorAll(".vue-component.chart")) {
	new Vue({
		render: h => h(App, {
			props: {...elem.dataset},
		}),
	}).$mount(elem);
}
