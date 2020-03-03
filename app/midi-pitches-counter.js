
import Vue from "vue";
import App from "./views/midi-pitches-counter.vue";



for (const elem of document.querySelectorAll(".vue-component.midi-pitches-counter")) {
	new Vue({
		render: h => h(App, {
			props: {...elem.dataset},
		}),
	}).$mount(elem);
}
