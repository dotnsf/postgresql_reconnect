//. newapp.js
var express = require( 'express' ),
    app = express();

var PG = require( 'pg' );

//. PostgreSQL
var pg_hostname = 'localhost';
var pg_port = 5432;
var pg_database = 'mydb';
var pg_username = 'admin';
var pg_password = 'P@ssw0rd';

var retry_ms = 5000;  //. retry every 5 sec

var connectionString = "postgres://" + pg_username + ":" + pg_password + "@" + pg_hostname + ":" + pg_port + "/" + pg_database;//+ "?sslmode=verify-full";
console.log( 'connecting...' );
var pg = new PG.Pool({
  connectionString: connectionString
});
pg.on( 'error', function( err ){
  console.log( 'db error on starting', err );
  if( err.code && err.code.startsWith( '5' ) ){
    //. terminated by admin?
    try_reconnect( retry_ms );
  }
});

function try_reconnect( ts ){
  setTimeout( function(){
    console.log( 'reconnecting...' );
    pg = new PG.Pool({
      connectionString: connectionString
    });
    pg.on( 'error', function( err ){
      console.log( 'db error on working', err );
      if( err.code && err.code.startsWith( '5' ) ){
        //. terminated by admin?
        try_reconnect( ts );
      }
    });
  }, ts );
}

//. top
app.get( '/', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( { status: true }, null, 2 ) );
  res.end();
});

//. ping
app.get( '/ping', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var conn = null;
  try{
    conn = await pg.connect();
    var sql = 'select 1';
    var query = { text: sql, values: [] };
    conn.query( query, function( err, result ){
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
  }catch( e ){
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: e }, null, 2 ) );
    res.end();
  }finally{
    if( conn ){
      conn.release();
    }
  }
});


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
