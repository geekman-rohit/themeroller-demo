var themeroller = require( "./themeroller" );
data = {
	name: "Hi there",
	data: {
		"base-font": "stupid"
	}
}
var theme = themeroller.getTheme( data );
theme.save( function() {
	console.log( theme.id );
} )
