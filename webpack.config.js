const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifier = require('webpack-build-notifier');
const isProduction = process.env.NODE_ENV === 'production';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const EslintFriendlyFormatter = require("eslint-friendly-formatter");
//const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCE_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const extractPlugin = new ExtractTextPlugin({
	filename: 'css/[name].bundle.css'
});

module.exports = {
	devtool: 'source-map',
	entry: [
		'babel-polyfill',	
		SOURCE_PATH+'/app/js/index.js',
	],
	output: {
		path: DIST_PATH,
		filename: 'js/[name].bundle.js',
		publicPath: ASSET_PATH
	},
	module: {
		rules: [
			/*{	
				enforce: 'pre',
				test: /\.(js|json)?$/,
				include: [path.join(SOURCE_PATH , "app")],
				exclude: [path.join(__dirname, 'node_modules')],
				use: [{
					loader: "eslint-loader",
					options: { 
						fix: true,
						cache: true,
						formatter: EslintFriendlyFormatter,
						emitError: true,
						quiet: false,
						failOnWarning: false,
						failOnError: false,
						outputReport: {
							formatter: EslintFriendlyFormatter
						}
					}
				}]
			},*/
			{
				test: /\.(jsx|js|json)?$/,
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015', 'react', 'stage-2']
					}
				}]
			},
			{
				test: /\.css?$/,
				use: extractPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader']
				})
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				use: [
					  {
						  loader: 'url-loader',
						  options: {
							  name: 'css/[name].[ext]',
							  limit: 100000
						  }
					  }
				]
			}
		]
	},
	resolve : {
		extensions: ['.js', '.json', '.jsx'],
		modules: ['node_modules']
	},
	plugins: [
		new WebpackBuildNotifier(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		extractPlugin/*,
		/new HtmlWebpackPlugin({
			title: 'React Test App',
			template: 'src/templates/index.ejs'
		})*/
	]
};
