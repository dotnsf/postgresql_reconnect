//. oldapp.js

var express = require( 'express' ),
    app = express();

var settings = require( './oldsettings' );


//. top
app.get( '/', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( { status: true }, null, 2 ) );
  res.end();
});

//. ping
app.get( '/ping', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var sql = 'select 1';
  var query = { text: sql, values: [] };
  settings.pg.query( query, function( err, result ){
    if( err ){
      console.log( { err } );
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: err }, null, 2 ) );
      res.end();
    }else{
      //console.log( { result } );
      res.write( JSON.stringify( { status: true, result: result }, null, 2 ) );
      res.end();
    }
  });
});


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
