
//const htmlCommonTemplate = "./app/html/CommonTemplate.html";



module.exports = {
	publicPath: "./",
	outputDir: "./source/vue",
	pages: {
		sample: {
			entry: "./app/sample.js",
			//template: htmlCommonTemplate,
		},
	},
	chainWebpack: config => {
		config.output.filename("./[name].js");
		config.output.chunkFilename("./[name].js");

		config.plugins.delete("html");
	},
};
