var express = require( "express" ),
    bodyParser = require( "body-parser" ),

    multer = require( "multer" ),
    app = express(),
    fs = require( "fs" ),
    themeroller = require( "./themeroller" ),
    server;
app.use ( "/static", express.static( "public" ) );
app.use ( "/static", express.static( "public" ) );
app.use ( "/chassis", express.static( "../css-chassis/" ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded ( { extended: true } ) );
app.use( multer() );

app.post( "/api", function( req, res ) {
    data = req.body;
    fullData = {};
    if ( "name" in data ) {
        fullData.name = data.name;
    }
    if ( "data" in data  ) {
        fullData.data = data.data;
    }

    if ( "id" in data ) {

        id = parseInt( data.id );
        theme = themeroller.getTheme( id );
        theme.fetch( function() {
            theme.update( fullData );
            theme.save( function() {
                theme.fetch( function() {
                    theme.compile( function() {
                        res.json( {
                            "name": theme.name,
                            "id": theme.id,
                            "data": theme.json,
                            "css": theme.css
                        } );
                    } )
                } )

            } )
        } )
    } else {
        theme = themeroller.getTheme( fullData );
        theme.save( function() {
            theme.fetch( function() {
                theme.compile( function() {
                    res.json( {
                        "name": theme.name,
                        "id": theme.id,
                        "data": theme.json,
                        "css": theme.css
                    } );
                } )
            } )
        } )
    }

} )

app.get( "/download", function( req, res ) {

    var id = req.query.id;
    id = parseInt( id);
    theme = themeroller.getTheme( id );
    theme.fetch( function() {
        theme.compile( function() {
            res.set( "Content-Type", "text/css" );
            res.set( "Content-Disposition", "attachment; filename='" + theme.name + "-theme.css'" );
            res.end( theme.css );
        } )
    } )


} );

server = app.listen( 3000, function() {
    console.log( "Listening..." );
} );
