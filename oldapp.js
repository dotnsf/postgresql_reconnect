//. oldapp.js
var express = require( 'express' ),
    app = express();

var PG = require( 'pg' );

//. PostgreSQL
var pg_hostname = 'localhost';
var pg_port = 5432;
var pg_database = 'mydb';
var pg_username = 'admin';
var pg_password = 'P@ssw0rd';

var pg_clinet = null;
var connectionString = "postgres://" + pg_username + ":" + pg_password + "@" + pg_hostname + ":" + pg_port + "/" + pg_database;//+ "?sslmode=verify-full";
var pg = new PG.Pool({
  connectionString: connectionString
});
pg.connect( function( err, client ){
  if( err ){
    //. 初回起動時に DB が動いていない
    console.log( 'no db on startup', err.code );
  }else{
    console.log( 'connected.' );
    pg_client = client;
  }
});

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
  pg_client.query( query, function( err, result ){
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
