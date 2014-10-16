module.exports = function ( grunt ) {

	require('load-grunt-tasks')(grunt);

	var tasksSetup = {
		pkg : grunt.file.readJSON("package.json"),
		config : require( './config.js'),

		/**
		 * The banner is the comment that is placed at the top of our compiled
		 * source files. It is first processed as a Grunt template, where the `<%=`
		 * pairs are evaluated based on this very configuration object.
		 */
		meta: {
			banner:
				'/**\n' +
					' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' * <%= pkg.homepage %>\n' +
					' *\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
					' */\n'
		},

		/**
		 * Increment version using semantic versioning conventions
		 *
		 */
		bump: {
			options: {
				files: ['package.json'],
				commit: false,
				createTag: false,
				push: false,
				// updateConfigs: [],
				// commitMessage: 'Release v%VERSION%',
				// commitFiles: ['package.json'],
				// tagName: 'v%VERSION%',
				// tagMessage: 'Version %VERSION%'
				// pushTo: 'upstream',
				// gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},

		clean: ['<%= config.compile_dir %>/*', '<%= config.tmp_dir %>/*' ],

		html2js: {
			dev: {
				options: {
					base: 'source/'
				},
				src: ['<%= config.src_dir %>/<%= config.app_files.tpls %>'],
				module: 'templates-app',
				dest: '<%= config.tmp_dir %>/js/templates-app.js'
			},
			build: {
				options: {
					base: 'source/'
				},
				src: ['<%= config.src_dir %>/<%= config.app_files.tpls %>'],
				module: 'templates-app',
				dest: '<%= config.compile_dir %>/js/templates-app.js'
			}
		},

		concat: {
			app: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: [
					'<%= config.src_dir %>/<%= config.app_files.js %>',
					'<%= config.tmp_dir %>/js/templates-app.js'
				],
				dest: '<%= config.compile_dir %>/js/app.js'
			},
			vendor: {
				src: [
					'<%= config.vendor_files.js %>'
				],
				dest: '<%= config.compile_dir %>/js/vendor.js'
			},
			dev: {
				src: [
					'<%= config.vendor_files.js %>'
				],
				dest: '<%= config.tmp_dir %>/js/vendor.js'
			}
		},

		/**
		 * Add AngularJS dependency injection annotations before minifying.
		 * (It allows us to code without the array syntax)
		 */
		ngAnnotate: {
			options: {
				singleQuotes: true,
			},
			app: {
				files: [{
					expand: true,
					src: ['<%= config.compile_dir %>/js/app.js']
				}],
			}
		},
		/**
		 * Minify the sources!
		 */
		uglify: {
			app: {
				options: {
					banner: '<%= meta.banner %>',
					preserveComments: false
				},
				files: {
					'<%= config.compile_dir %>/js/app.js':'<%= config.compile_dir %>/js/app.js'
				}
			},
			vendor: {
				files: {
					'<%= config.compile_dir %>/js/vendor.js':'<%= config.compile_dir %>/js/vendor.js'
				}
			}
		},

		sass: {
			dev: {
				options: {
					style: 'expanded',
					lineNumbers: true
				},
				files: {
					'<%= config.tmp_dir %>/css/main.css': '<%= config.src_dir %>/css/main.scss'
				}
			},

			dist: {
				options: {
					style: 'compressed',
					lineNumbers: false
				},
				files: {
					'<%= config.compile_dir %>/css/main.min.css': '<%= config.src_dir %>/css/main.scss'
				}
			}
		},

		connect: {
			dev: {
				options: {
					port: '<%= config.port %>',
					base: '<%= config.tmp_dir %>',
					hostname: '0.0.0.0'
				}
			}
		},

		open: {
			server: {
				path: 'http://localhost:<%= config.port %>'
			}
		},

		watch: {
			options: {
				livereload: true
			},

			html: {
				files: '<%= config.src_dir %>/**/*.html',
				tasks: ['processhtml:dev']
			},
			css: {
				files: '<%= config.src_dir %>/**/*.scss',
				tasks: ['sass:dev']
			},
			js: {
				files: '<%= config.src_dir %>/**/*.js',
				tasks: ['copy:dev']
			},
			tmpls: {
				files: '<%= config.src_dir %>/**/*.tpl.html',
				tasks: ['copy:dev']
			},
			assets: {
				files: ['<%= config.src_dir %>/assets/**/*', '<%= config.src_dir %>/docs/**/*'],
				tasks: ['copy:dev']
			}

		},

		copy: {
			dev: {
				files: [
					// includes files within path and its sub-directories
					{expand: true, cwd: '<%= config.src_dir %>/js/', src: ['**/*.js','**/*.tpl.html'], dest: '<%= config.tmp_dir %>/js/'},
					{expand: true, cwd: '<%= config.src_dir %>/assets/', src: ['**/*.png','**/*.svg'], dest: '<%= config.tmp_dir %>/assets/'},
					{expand: true, cwd: '<%= config.src_dir %>/css/fonts/', src: ['**/*'], dest: '<%= config.tmp_dir %>/css/fonts/'}
				]
			},
			dist: {
				files: [
					// includes files within path and its sub-directories
					//{expand: true, cwd: '<%= config.src_dir %>/js/', src: ['**/*.js','**/*.tpl.html'], dest: '<%= config.compile_dir %>/js/'},
					{expand: true, cwd: '<%= config.src_dir %>/assets/', src: ['**/*.png','**/*.svg'], dest: '<%= config.compile_dir %>/assets/'},
					{expand: true, cwd: '<%= config.src_dir %>/css/fonts/', src: ['**/*'], dest: '<%= config.compile_dir %>/css/fonts/'}
				]
			}
		},
		/**
		 * The `index` task compiles the `index.html` file as a Grunt template. CSS
		 * and JS files co-exist here but they get split apart later.
		 */
		index: {

			/**
			 * During development, we don't want to have wait for compilation,
			 * concatenation, minification, etc. So to avoid these steps, we simply
			 * add all script files directly to the `<head>` of `index.html`. The
			 * `src` property contains the list of included files.
			 */
			dev: {
				dir: '<%= config.tmp_dir %>',
				src: [
					'<%= concat.dev.dest %>',
					'<%= config.src_dir %>/js/**/*.js',
					'<%= html2js.dev.dest %>'
				],
				css: ['css/main.css']
			},

			/**
			 * When it is time to have a completely compiled application, we can
			 * alter the above to include only a single JavaScript and a single CSS
			 * file. Now we're back!
			 */
			dist: {
				dir: '<%= config.compile_dir %>',
				src: [
					'<%= concat.vendor.dest %>',
					'<%= concat.app.dest %>',
					'<%= html2js.build.dest %>'
				],
				css: ['css/main.min.css']
			}
		}
	};


	grunt.initConfig(tasksSetup);

	grunt.registerTask('server', [
		'clean',
		'copy:dev',
		'sass:dev',
		'html2js:dev',
		'concat:dev',
		'index:dev',
		'connect',
		'open',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',
		'copy:dist',
		'html2js:build',
		'sass:dist',
		'concat:app',
		'concat:vendor',
		'ngAnnotate',
		'uglify',
		'index:dist'
	]);

	/**
	 * A utility function to get all app JavaScript sources.
	 */
	function filterForJS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.js$/ );
		});
	}

	/**
	 * A utility function to get all app CSS sources.
	 */
	function filterForCSS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.css$/ );
		});
	}

	/**
	 * The index.html template includes the stylesheet and javascript sources
	 * based on dynamic names calculated in this Gruntfile. This task assembles
	 * the list into variables for the template to use and then runs the
	 * compilation.
	 */
	grunt.registerMultiTask( 'index', 'Process index.html template', function () {
		var buildTarget = grunt.option('target');

		var dirRE = new RegExp( '^('+grunt.config('config.src_dir')+'|'+grunt.config('config.tmp_dir')+'|'+grunt.config('config.compile_dir')+')\/', 'g' );
//		grunt.log.writeln('===  RegExp  ===');
//		grunt.log.writeln(dirRE);

		var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});

		var styleSrc = this.data.css;

		//TODO: inject CSS files
		grunt.file.copy('source/index.tpl.html', this.data.dir + '/index.html', {
			process: function ( contents, path ) {
				var config = {
					scripts: jsFiles,
					target: buildTarget,
					styles: styleSrc
				};
				/*
				 grunt.log.writeln('===  Target  ===');
				 grunt.log.writeln(buildTarget);

				 grunt.log.writeln('===  RegExp  ===');
				 grunt.log.writeln(dirRE);

				 grunt.log.writeln('===  Scripts  ===');
				 grunt.log.writeln(config.scripts);

				 grunt.log.writeln('===  Styles  ===');
				 grunt.log.writeln(config.styles);
				 */

				return grunt.template.process( contents, { data: config });
			}
		});
	});
};