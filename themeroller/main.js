var db = require( "../db" ),
	sass = require( "node-sass" ),
	fs = require( "fs" );

function Theme( data ) {
	if ( typeof( data ) === "number" ) {
		this.id = data;
		this.jsonData = false;
	}
	if ( typeof( data ) === "object" ) {
		this.jsonData = data;
		this.name = data.name ;
		if ( "data" in data ) {

			if ( typeof( data.data ) !== "object" ) {
				this.json = JSON.parse( data.data )
			} else {
				this.json = data.data
				this.jsonData.data = JSON.stringify( data.data );
			}
		}

		this.id = false;
	}
	this. css = false;
}

Theme.prototype.fetch = function( callback ) {
	var data, theme;
	theme = this;
	if ( this.id ) {
		data = db.fetch( this.id, function( data ) {
			data = data[0];
			theme.jsonData = data;
			theme.name = data.name ;
			if ( !data.data ) {
				theme.json = false;
			} else {
				theme.json = JSON.parse( data.data );
			}
			if ( typeof( callback ) == "function" ) {
				callback();
			}
		} );
	}
}

Theme.prototype.save = function( callback ) {
	var theme = this;
	if ( !this.id ) {
		db.insert( this.jsonData, function( data ) {
			theme.id = data.insertId;
			if ( typeof( callback ) == "function" ) {
				callback();
			}
		} )

	} else {
		var udata = {};
		if ( this.name ) {
			udata.name = this.name;
		}
		if ( this.json ) {
			udata.data = JSON.stringify( this.json )
		}
		db.update( this.id, udata, function( data ) {
			if ( typeof( callback ) == "function" ) {
				callback();
			}
		} )
	}
}

Theme.prototype.getJSON = function() {
	return this.jsonData;
}

Theme.prototype.update = function( fullData ) {
	if ( "name" in fullData ) {
		this.name = fullData.name;
	}
	if ( "data" in fullData ) {
		this.json = fullData.data;
	}
}
Theme.prototype.getCSS = function() {
	return this.css;
}
Theme.prototype.compile = function( callback ) {

	var theme = this,
		content = this.json,
		fileData = "",
		key;
	if ( this.json ) {
		for ( key in content ) {
			if ( content.hasOwnProperty( key ) ) {
				fileData += key + ": " + content[key] + "; \n"
			}
		}

		fs.writeFile( "./public/_var.scss", fileData, function( err ) {
			if ( err ) {
				throw( err );
				return;
			}
			var result = sass.renderSync( {
				file: "public/input.scss"
			} );
			theme.css = result.css.toString();
			console.log( result.css.toString() );
			if ( typeof( callback ) == "function" ) {
				callback();
			}
		} );
	} else {
		theme.css = "";
		callback();
	}
}

module.exports = {
	getTheme: function( data ) {
		return new Theme( data );
	}
}
