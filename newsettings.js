//. newsettings.js
//. ローカルホストからアプリを実行する際に使う設定ファイル
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
  connectionString: connectionString,
  idleTimeoutMillis: ( 1 * 86400 * 1000 )  //. 1 days : https://node-postgres.com/api/pool#new-pool-config-object-
});
pg.on( 'error', function( err ){
  console.log( 'db error on starting', err );
  if( err.code && err.code.startsWith( '5' ) ){
    //. terminated by admin?
    try_reconnect( retry_ms );
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
      console.log( 'db error on working', err );
      if( err.code && err.code.startsWith( '5' ) ){
        //. terminated by admin?
        try_reconnect( ts );
      }
    });
    module.exports.pg = pg;
  }, ts );
}
