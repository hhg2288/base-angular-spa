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

		clean: ['<%= config.compile_dir %>/*', '<%= config.tmp_dir %>/*' ],

		processhtml: {
			dev: {
				files: {
					'<%= config.tmp_dir %>/index.html': ['<%= config.src_dir %>/index.html']
				}
			},
			dist: {
				files: {
					'<%= config.compile_dir %>/index.html': ['<%= config.src_dir %>/index.html']
				}
			}
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>'
			},
			dev: {
				src: [
					'b_components/angular/angular.js',
					'b_components/angular-animate/angular-animate.js',
					'b_components/angular-sanitize/angular-sanitize.js',
					'b_components/angular-ui-router/release/angular-ui-router.js'
				],
				dest: '<%= config.tmp_dir %>/js/vendor.js'
			},
			dist: {
				src: [
					'b_components/angular/angular.js',
					'b_components/angular-animate/angular-animate.js',
					'b_components/angular-sanitize/angular-sanitize.js',
					'b_components/angular-ui-router/release/angular-ui-router.js'
				],
				dest: '<%= config.compile_dir %>/js/vendor.js'
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
					{expand: true, cwd: '<%= config.src_dir %>/docs/', src: ['**/*'], dest: '<%= config.tmp_dir %>/docs/'}
				]
			},
			dist: {
				files: [
					// includes files within path and its sub-directories
					{expand: true, cwd: '<%= config.src_dir %>/js/', src: ['**/*.js','**/*.tpl.html'], dest: '<%= config.compile_dir %>/js/'},
					{expand: true, cwd: '<%= config.src_dir %>/assets/', src: ['**/*.png','**/*.svg'], dest: '<%= config.compile_dir %>/assets/'},
					{expand: true, cwd: '<%= config.src_dir %>/docs/', src: ['**/*'], dest: '<%= config.compile_dir %>/docs/'}
				]
			}
		}
	};


	grunt.initConfig(tasksSetup);

	grunt.registerTask('server', [
		'clean',
		'copy:dev',
		'processhtml:dev',
		'sass:dev',
		'concat:dev',
		'connect',
		'open',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',
		'copy:dev',
		'processhtml:dist',
		'sass:dist',
		'concat:dist'
	]);
};