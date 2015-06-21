function getURLParameter( param )
{
    var url = window.location.search.substring( 1 ),
    variables = url.split( "&" ),
	i, j, params;
    for ( i = 0; i < variables.length; i++ )
    {
        params = variables[i].split( "=" );
        if ( params[0] == param )
        {
            return params[1];
        }
    }
	return ""
}

function init ( ele ) {
	var data = {
		"$primary-color": "#000000",
		"$font-stack": "Helvetica, sans-serif"
	},
	id = getURLParameter( "id" );

	fullData = {}

	if ( id ) {
		fullData.id = id;
		console.log( id )
		$.post( "/api", fullData, function( data ) {
			console.log( data );
			ele.append( "<style>" + data.css + "</style>" );
			$( "#primary-color" ).val( data.data["$primary-color"] );
			$( "#base-font" ).val( data.data["$font-stack"] );
			$( "#theme-name" ).val( data.name );
		}  );

	} else {
		$( "#primary-color" ).val( data["$primary-color"] );
		$( "#base-font" ).val( data["$font-stack"] );
	}

$( "a#api" ).click( function() {
	var id = getURLParameter( "id" );
	if ( id ) {
		window.open( "/download?id=" + id );
	}
} );

}
var update = function( color, font, ele ) {
	var data = {
		"$primary-color": color,
		"$font-stack": font
	},
	fullData = {
		"data": data
	},
	id = getURLParameter( "id" );
	if ( id ) {
		fullData.id = id;
	}

	// $( "a#api" ).attr( "href", "/download/?q=" + uriData  );

	$.post( "/api", fullData, function( data ) {
		console.log( data );
		ele.append( "<style>" + data.css + "</style>" );
		if ( !id ) {
			id = data.id;
			stateObj = {};
			customUrl = "?id=" + id;
			history.pushState( stateObj, "Themeroller", customUrl );

		}
	}  );
}

var updateName = function( name, id ) {
	var fullData = {
		"name": name
	},
	id = getURLParameter( "id" ),
	stateObj, customUrl;
	console.log( id );
	if ( id ) {
		fullData.id = id;
	}

	// $( "a#api" ).attr( "href", "/download/?q=" + uriData  );

	$.post( "/api", fullData, function( data ) {
		console.log( data );
		if ( !id ) {
			id = data.id;
			stateObj = {};
			customUrl = "?id=" + id;
			history.pushState( stateObj, "Themeroller", customUrl );

		}
	}  );

}

$( function() {
$( ".mods input" ).change( function() {
update( $( "#primary-color" ).val(),
	$( "#base-font" ).val(),
	$( "#preview" ).contents().find( "head" ) );
} )

$( "#theme-name" ).change( function() {
	updateName( $( this ).val() );
} )

$( "#preview" ).load( function() {

$( "#preview" ).height( $( "#preview" ).contents().find( "body" ).height() + 100 + "px" );
init( $( "#preview" ).contents().find( "head" ) );
} );
} );
