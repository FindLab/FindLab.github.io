
//const htmlCommonTemplate = "./app/html/CommonTemplate.html";


const entries = [
	"sample",
	"midi-player",
	"soundfont-loader",
	"midi-pitches-counter",
	"midi-pitches-mask",
	"midi-head-mask",
	"chart",
	"staff-layout-viewer",
];



module.exports = {
	publicPath: "/vue/",
	outputDir: "./source/vue",
	filenameHashing: false,
	pages: entries.reduce((table, name) => ({...table, [name]: {
		entry: `./app/${name}.js`,
	}}), {}),
	css: {
		extract: false,
	},
	chainWebpack: config => {
		config.output.filename("./[name].js");
		config.output.chunkFilename("./[name].js");

		//config.optimization.delete("splitChunks");

		entries.forEach(name => {
			config.plugins.delete(`html-${name}`);
			config.plugins.delete(`preload-${name}`);
			config.plugins.delete(`prefetch-${name}`);
		});
	},
};
