<template>
	<div>
		<p>This is a vue component example.</p>
		<button @click="hello">hello</button>
	</div>
</template>

<script>
	export default {
		name: "sample",


		methods: {
			hello () {
				alert("hello!");
				console.log("sample.vue: it works.");
			},
		},
	};
</script>
