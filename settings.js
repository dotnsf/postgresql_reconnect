//. settings.js
//. ローカルホストからアプリを実行する際に使う設定ファイル
var PG = require( 'pg' );

//. PostgreSQL
var pg_hostname = 'localhost';
var pg_port = 5432;
var pg_database = 'mydb';
var pg_username = 'admin';
var pg_password = 'P@ssw0rd';

var connectionString = "postgres://" + pg_username + ":" + pg_password + "@" + pg_hostname + ":" + pg_port + "/" + pg_database;//+ "?sslmode=verify-full";
var pg = new PG.Pool({
  connectionString: connectionString,
  idleTimeoutMillis: ( 1 * 86400 * 1000 )  //. 1 days : https://node-postgres.com/api/pool#new-pool-config-object-
});
pg.connect( function( err, client ){
  if( err ){
    //. 初回起動時に DB が動いていない
    console.log( 'no db on startup', err.code );
  }else{
    console.log( 'connected.' );
    exports.pg = client;
  }
});
