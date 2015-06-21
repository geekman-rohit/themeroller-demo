var readline = require( "readline" ),
	fs = require( "fs" ),
	model = require( "./db" ),
	iface, data;

iface = readline.createInterface( {
	input: process.stdin,
	output: process.stdout
} );

iface.question( "Enter Database Name to use (themeroller) : ", function( dbname ) {
	if ( !dbname ) {
		dbname = "themeroller";
	}
	iface.question( "Enter Username (root) : ", function( username ) {
		if ( !username ) {
			username = "root";
		}
		iface.question( "Enter Password for " + username + " : ", function( password ) {
			if ( !password ) {
				password = "";
			}
			data = {
				"dbname": dbname,
				"username": username,
				"password": password
			};
			iface.close();
			data = JSON.stringify( data );
			fs.writeFileSync( "db/config.json", data );
			console.log( "Database name set to " + dbname + " and username to " + username );
			model.setup();
			console.log( "Setup Complete!" )

		} )
	} )
} )
