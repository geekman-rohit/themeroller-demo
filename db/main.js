var mysql = require( "mysql" ),
	fs = require( "fs" ),
	connection, server, config;

db = {
	setup: function() {
		var config = JSON.parse( fs.readFileSync( "./db/config.json" ).toString() ),
		connection = this.getRawConnection( config );
		connection.query( "create database if not exists " + config.dbname,

		function( err, rows, fields ) {
			var table;
			if ( err ) {
				throw err;
			}
			connection.query( "use " + config.dbname );
			table = fs.readFileSync( "./db/theme.sql" ).toString()
			connection.query( table, function( err, rows ) {
				if ( err ) {
					throw err;
				}
			} )
		} );
	},

	getRawConnection: function( config ) {

		var connection = mysql.createConnection( {
			host: "localhost",
			user: config.username,
			password: config.password
		} );
		return connection;
	},

	getConnection: function() {

		/* ToDo : Conside a Cache for Connection object to reuse */

		var config = JSON.parse( fs.readFileSync( "./db/config.json" ).toString() ),
		connection = this.getRawConnection( config );
		connection.query( "use " + config.dbname );
		return connection;
	},

	insert: function( theme, callback ) {
		this.runQuery( "insert into theme SET ? ", theme, callback )
	},
	update: function( id, theme, callback ) {
		var query = "", count = 0,
		params = [];
		console.log( theme );
		for ( key in theme ) {
			if ( theme.hasOwnProperty( key ) ) {
				if ( count > 0 ) {
					query += ","
				}
				count++;
				query += key + "= ? ";

				params.push( theme[key] );
			}
		}
		params.push( id );
		console.log( "update theme SET " + query + " where id = :tid " )
		console.log( params )
		this.runQuery( "update theme SET " + query + " where id = ? ",  params, callback )
	},

	fetch: function( id, callback ) {
		this.runQuery( "select* from theme where id = ? ", [ id ], callback );
	},

	runQuery: function( query, data, callback ) {
		var connection = this.getConnection();
		connection.query( query, data, function( err, rows ) {
			if ( err ) {
				throw err;
			}
			if ( typeof( callback ) == "function" ) {
				callback( rows );
			}
		} );
	}

}
module.exports = db;
