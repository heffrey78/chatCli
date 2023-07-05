# chat-cli

## Steps to run this project:
1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Fire up Postgres: postgres -D "C:\Program Files\PostgreSQL\15\data"
4. Run `npm run start-ts` command
5. Need to Dockerize postgres. Until then, make sure postgres is running: `postgres -D "C:\Program Files\PostgreSQL\15\data"`.

## Commands
1. All commands are prepended by a `.`. Currently, commands can be discovered in the types.ts file.
2. To execute a command enter it on a line, hit return. Type a period on the next line and hit return again.

## Chat
1. If a text line does not begin with a `.` it will be interpreted by the program as chat input.
2. To send chat input, hit return. Type a period on the next line and hit return again.

## Configuration
1. Update configuration with the .config command. Configuration is currently stored in config.json. 
    a. model -> gpt-3-turbo or gpt-4
    b. code -> chat is geared towards coding (system message and code saving)
2. Example: `.config 'code' 'true'` 
3. Your .env file should have the following entries:
```
OPENAI_API_KEY=
GOOGLE_API_KEY=
CODE=true
MODEL=gpt-4
CONFIGPATH=./config.json
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=chatcli
USE_POSTGRES=true
```
Currently, Postgres is only used for saving and opening conversations. You can run the postgres container that support pg-vector by running the docker run command below. If you don't use postgres, conversations will be stored to json. Eventually, the program will use postgres more extensivley and json support will be relegated to exporting conversations.

### Docker notes

docker pull ankane/pgvector

docker run --name chat-postgres -e POSTGRES_PASSWORD=BigBlockRed15! -e PGDATA=/var/lib/postgresql/data/pgdata -v postgres-data:/var/lib/postgresql/data -p 5432:5432 --rm ankane/pgvector

npx typeorm-ts-node-esm migration:generate ./src/migration/{update-class-name} -d ./src/data-source.ts

psql.exe "host=localhost port=5432 dbname=chatcli user=postgres sslmode=prefer connect_timeout=10"

psql "host=localhost port=5432 dbname=chatcli user=postgres sslmode=prefer connect_timeout=10"