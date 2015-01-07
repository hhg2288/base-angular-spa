(function(){

	// Gulp Plugins declarations

	var gulp 						= require('gulp'),
			del							= require('del'),
			wiredep					= require('wiredep'),
			connect					= require('gulp-connect-multi')(),
			gulpLoadPlugins = require('gulp-load-plugins'),
			plugins 				= gulpLoadPlugins(),
			port						= 1337;


	////////////////////


	// Gulp public tasks
	gulp
		.task('default', function () {

			var mssg = "\n\nNAME:\n\n	Gulp Task Manager\n\nSYNOPSIS:\n\n	Gulp task manager Manual\n\nAPI:\n\n	gulp serve\n	gulp build\n	gulp deploy";

			plugins.util.log(
				plugins.util.colors.green(mssg)
			);
		})

		.task('serve',
			[
				'connect',
				'html2js',
				'copyJS',
				'vendor-scripts',
				'sass',
				'index'
			], function () {

			plugins.util.log(plugins.util.colors.yellow('[CONNECT] Listening on port ' + port));

			plugins.util.log(plugins.util.colors.blue('[CONNECT] Watching HTML, JS and CSS files for live-reload'));

			gulp.watch("source/css/*.scss", ['sass']);
			gulp.watch('source/js/**/*.js', ['copyJS']);
			gulp.watch('source/**/*.tpl.html', ['html2js']);
			gulp.watch('source/index.html', ['index']);
			gulp.watch('bower.json', ['vendor-scripts']);

		})

	.task('build', [], function(){

		gulp.src('source/js/**/*.js')
			.pipe(plugins.uglify())
			.pipe(plugins.concat('app.min.js'))
			.pipe(gulp.dest('dist/js'));

		gulp.src('source/css/main.scss')
			.pipe(plugins.sass())
			.pipe(plugins.concat('main.min.css'))
			.pipe(plugins.minifyCss({benchmark:true}))
			.pipe(gulp.dest('dist/css'));
	});


	////////////////////


	// Gulp private tasks
	gulp
		.task('clean', function(){
			del([
				'.tmp/'
			])
		})

		.task('connect', connect.server({
			root: ['.tmp'],
			port: 1337,
			livereload: true,
			open: {
				browser: 'Google Chrome' // if not working OS X browser: 'Google Chrome'
			}
		}))

		.task('html2js', function(){

			return gulp.src('source/js/**/*.tpl.html')
				.pipe(plugins.html2js({
					outputModuleName: 'app-templates',
					useStrict: true
				}))
				.pipe(plugins.concat('app-templates.js'))
				.pipe(gulp.dest('.tmp/js/'))
				.pipe(connect.reload());
		})

		.task('sass', function () {

			return gulp.src('source/css/main.scss')
				.pipe(plugins.sass())
				.pipe(gulp.dest('.tmp/css'))
				.pipe(connect.reload());
		})

		.task('copyJS', function(){

			return gulp.src('source/**/*.js')
				.pipe(gulp.dest('.tmp/'))
				.pipe(connect.reload());
		})

		.task('vendor-scripts', function() {

			return gulp
				.src(wiredep().js)
				.pipe(gulp.dest('.tmp/vendor'))
				.pipe(connect.reload());
		})

		.task('index', ['vendor-scripts', 'copyJS'], function() {

			return gulp
				.src('source/index.html')
				.pipe(wiredep.stream({
					fileTypes: {
						html: {
							replace: {
								js: function(filePath) {
									return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
								},
								css: function(filePath) {
									return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
								}
							}
						}
					}
				}))

				.pipe(plugins.inject(
					gulp.src(['.tmp/js/**/*.js'], { read: false }), {
						addRootSlash: false,
						transform: function(filePath, file, i, length) {
							return '<script src="' + filePath.replace('.tmp/', '') + '"></script>';
						}
					}))

				.pipe(plugins.inject(
					gulp.src(['.tmp/css/**/*.css'], { read: false }), {
						addRootSlash: false,
						transform: function(filePath, file, i, length) {
							return '<link rel="stylesheet" href="' + filePath.replace('.tmp/', '') + '"/>';
						}
					}))

				.pipe(gulp.dest('.tmp'))
				.pipe(connect.reload());
		});

})();