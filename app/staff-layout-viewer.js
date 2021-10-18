
import Vue from "vue";
import App from "./views/staff-layout-viewer.vue";



for (const elem of document.querySelectorAll(".vue-component.staff-layout-viewer")) {
	new Vue({
		render: h => h(App, {
			props: {...elem.dataset},
		}),
	}).$mount(elem);
}
