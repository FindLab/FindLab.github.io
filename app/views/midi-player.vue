<template>
	<div></div>
</template>

<script>
	export default {
		name: "midi-player",


		props: {
			url: String,
		},


		mounted () {
			console.log("midi-player:", this.url);
		},
	};
</script>
