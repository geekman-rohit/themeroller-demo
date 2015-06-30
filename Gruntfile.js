module.exports = function( grunt ) {

grunt.initConfig( {
	pkg: grunt.file.readJSON( "package.json" ),
	jshint: {
		files: [ "*.js", "routes/**.js" ],
		options: {
			jshintrc: ".jshintrc"
		}
	},
	jscs: {
		src: [ "*.js" ]
	},
	csslint: {
		files: [ "public/stylesheets/**.css" ],
		options: {
			csslintrc: ".csslintrc"
		}
	}

} );
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-jscs" );
grunt.loadNpmTasks( "grunt-contrib-csslint" );
grunt.registerTask( "default", [ "jshint", "jscs", "csslint" ] );

};
