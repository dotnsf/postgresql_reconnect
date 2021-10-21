//. dump.js
//. ローカルホストからアプリを実行する際に使う設定ファイル
var PG = require( 'pg' );

//. PostgreSQL
var pg_hostname = 'localhost';
var pg_port = 5432;
var pg_database = 'mydb';
var pg_username = 'admin';
var pg_password = 'P@ssw0rd';

var initial_ms = 1000;  //. 初期ウェイト値
var ms = initial_ms;    //. 現在のウェイト値

var connectionString = "postgres://" + pg_username + ":" + pg_password + "@" + pg_hostname + ":" + pg_port + "/" + pg_database;//+ "?sslmode=verify-full";
console.log( 'connecting...' );
var pg = new PG.Pool({
  connectionString: connectionString,
  idleTimeoutMillis: ( 1 * 86400 * 1000 )  //. 1 days : https://node-postgres.com/api/pool#new-pool-config-object-
});
pg.on( 'error', function( err ){
  console.log( 'on error on working', err );
  if( err.code && err.code.startsWith( '5' ) ){
    //. terminated by admin?
    try_reconnect( ms );
  }
});
module.exports.pg = pg;

function try_reconnect( ts ){
  setTimeout( function(){
    console.log( 'reconnecting...' );
    pg = new PG.Pool({
      connectionString: connectionString,
      idleTimeoutMillis: ( 1 * 86400 * 1000 )
    });
    pg.on( 'error', function( err ){
      console.log( 'on error on retry(' + ts + ')', err );
      if( err.code && err.code.startsWith( '5' ) ){
        //. terminated by admin?
        ts = ( ts < 10000 ? ( ts + 1000 ) : ts );
        try_reconnect( ts );
      }
    });
    module.exports.pg = pg;
  }, ts );
}

/*
async function connect(){
  return new Promise( async ( resolve, reject ) => {
    pg.connect( async function (err, client) {
      if (err) {
        //. 起動時に DB が動いていない
        console.log( 'no db', err.code );
        resolve( null );
      } else {
        console.log( 'connected.' );
        resolve( client );
      }
    });
  });
}
*/
