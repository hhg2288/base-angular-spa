module.exports = {
	"src_dir": "source",
	"compile_dir": "dist",
	"tmp_dir": ".tmp",
	"port": "4444",
	vendor_files: {
		js: [
			'b_components/angular/angular.js',
			'b_components/angular-animate/angular-animate.js',
			'b_components/angular-sanitize/angular-sanitize.js',
			'b_components/angular-ui-router/release/angular-ui-router.js',
			'b_components/lodash/dist/lodash.js'
		],
		css: [
			'css/main.min.css'
		]
	},
	app_files: {
		tpls: [ 'js/**/*.tpl.html' ],
		js: [ 'js/**/*.js'],
		assets: ['assets/**/*', 'css/fonts/*']
	}

};
