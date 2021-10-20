//. settings.js
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
var pg = new PG.Client({
  connectionString: connectionString,
  idleTimeoutMillis: ( 1 * 86400 * 1000 )  //. 1 days : https://node-postgres.com/api/pool#new-pool-config-object-
});
pg.connect( function( err, client ){
  if( err ){
    //. 初回起動時に DB が動いていない
    console.log( 'no db on startup', err.code );
    try_reconnect( ms );
  }else{
    console.log( 'connected.' );
    exports.pg = client;
  }
});
pg.on( 'error', function( err ){
  console.log( 'on error on startup', err.code );
  if( err.code == '57P01' ){
    //. terminated by admin?
    try_reconnect( ms );
  }
});

function try_reconnect( ts ){
  setTimeout( function(){
    pg = new PG.Client({
      connectionString: connectionString,
      idleTimeoutMillis: ( 1 * 86400 * 1000 )
    });
    pg.connect( function( err, client ){
      if( err ){
        //. 接続リトライ時に DB が動いていない
        console.log( 'no db on retry(' + ts + ')', err.code );
        try_reconnect( ts < 10000 ? ts + 1000 : ts );
      }else{
        console.log( 'reconnected(' + ts + ').' );
        ts = initial_ms;
        exports.pg = client;
      }
    });
    pg.on( 'error', function( err ){
      console.log( 'on error on retry(' + ts + ')', err.code );
      if( err.code == '57P01' ){
        //. terminated by admin?
        try_reconnect( ms + 1000 );
      }
    });
  }, ts );
}
