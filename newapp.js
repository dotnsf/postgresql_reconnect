//. newapp.js

var express = require( 'express' ),
    app = express();

var settings = require( './newsettings' );


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
    conn = await settings.pg.connect();
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
