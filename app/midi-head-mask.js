
import Vue from "vue";
import App from "./views/midi-head-mask.vue";



for (const elem of document.querySelectorAll(".vue-component.midi-head-mask")) {
	const notation = elem.innerText && JSON.parse(elem.innerText);

	new Vue({
		render: h => h(App, {
			props: {notation, ...elem.dataset},
		}),
	}).$mount(elem);
}
