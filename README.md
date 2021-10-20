# postgresql_reconnect

## Overview

PostgreSQL reconnect sample.

This app tries to connect PostgreSQL DB on startup. If PostgreSQL was terminated, app tries to reconnect it every 10sec.


## Prepare docker

`$ docker run -it --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=P@ssw0rd -e POSTGRES_DB=mydb -p 5432:5432 postgres`

`$ psql "user=admin port=5432 host=localhost dbname=mydb password=P@ssw0rd"`


## Licensing

This code is licensed under MIT.


## Copyright

2021 K.Kimura @ Juge.Me all rights reserved.

