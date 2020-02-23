
//const htmlCommonTemplate = "./app/html/CommonTemplate.html";



module.exports = {
	publicPath: "./",
	outputDir: "./source/vue",
	filenameHashing: false,
	pages: {
		sample: {
			entry: "./app/sample.js",
			//template: htmlCommonTemplate,
		},
	},
	chainWebpack: config => {
		config.output.filename("./[name].js");
		config.output.chunkFilename("./[name].js");

		config.plugins.delete("html-sample");
		config.plugins.delete("preload-sample");
		config.plugins.delete("prefetch-sample");
	},
};
