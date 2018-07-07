const webpack = require("webpack");
const path = require('path');

module.exports = {
	entry: {
		popup: path.join(__dirname, 'src/popup.tsx'),
	},
	output: {
		path: path.join(__dirname, 'distro/js'),
		filename: '[name].js'
	},
	devtool: "source-map",
	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{ test: /\.tsx?$/, include: path.resolve(__dirname, "src"), loader: "awesome-typescript-loader" },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ test: /\.js$/, include: path.resolve(__dirname, "src"), loader: "source-map-loader", enforce: 'pre' },

			{ test: /\.css$/, include: path.resolve(__dirname, "src"), use: ['style-loader', 'css-loader'] },
			{ test: /\.(sass|scss)$/, include: path.resolve(__dirname, "src"), use: ['style-loader', 'css-loader', 'sass-loader'] },
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		modules: [path.resolve(__dirname, './src'), 'node_modules']
	},
	plugins: [

	]
};

const UglifyEsPlugin = require('uglify-es-webpack-plugin');

if (process.env.NODE_ENV === 'production') {
	console.log("PRODUCTION build");

	module.exports.plugins = (module.exports.plugins || []).concat([
		// This is weird, why do we need this? We just checked that value.
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new UglifyEsPlugin()
	]);
}