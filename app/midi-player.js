
import Vue from "vue";
import App from "./views/midi-player.vue";



for (const elem of document.querySelectorAll(".vue-component.midi-player")) {
	//console.log("elem:", elem.dataset);
	new Vue({
		render: h => h(App, {
			props: {...elem.dataset},
		}),
	}).$mount(elem);
}
