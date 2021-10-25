# postgresql_reconnect

## Overview

PostgreSQL reconnect sample( with Connection Pooling).

This app tries to connect PostgreSQL DB on startup. If PostgreSQL was terminated, app tries to reconnect it every 5sec.


## Prepare docker

- `$ docker run -d --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=P@ssw0rd -e POSTGRES_DB=mydb -p 5432:5432 postgres`

  - `$ docker run -d --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=P@ssw0rd -e POSTGRES_DB=mydb -p 5432:5432 -v /tmp/postgres/data:/var/lib/postgresql/data postgres`

- `$ psql "user=admin port=5432 host=localhost dbname=mydb password=P@ssw0rd"`


## How to demonstrate

- Start application

  - Old one(with Connection Pooling)

    - `$ npm run old`

  - New one(with Connection Pooling)

    - `$ npm run new`

- Access to application

  - Top( `{ status: true }` )

    - `http://localhost:8080/`

  - Ping( result of SQL )

    - `http://localhost:8080/ping`


## Expected result

- Old

  - Application works successfully if db have been working and not stopped.

  - If db stopped, app would be crashed and not be able to respond even if db would start again.

- New

  - Application works successfully even if db have been stopped. It doesn't matter wether if db would be started again or not.

  - If db would start again, application would connect it again automatically, and returns SQL result for `GET /ping` request.


## Licensing

This code is licensed under MIT.


## Copyright

2021 K.Kimura @ Juge.Me all rights reserved.

