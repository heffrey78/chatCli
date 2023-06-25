# chat-cli

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Fire up Postgres: postgres -D "C:\Program Files\PostgreSQL\15\data"
4. Run `npm run start-ts` command
5. Need to Dockerize postgres. Until then, make sure postgres is running: `postgres -D "C:\Program Files\PostgreSQL\15\data"`.

Commands
1. All commands are prepended by a `.`. Currently, commands can be discovered in the types.ts file.
2. To execute a command enter it on a line, hit return. Type a period on the next line and hit return again.

Chat
1. If a text line does not begin with a `.` it will be interpreted by the program as chat input.
2. To send chat input, hit return. Type a period on the next line and hit return again.

Configuration
1. Update configuration with the .config command. Configuration is currently stored in config.json. 
    a. model -> gpt-3-turbo or gpt-4
    b. code -> chat is geared towards coding (system message and code saving)
    c. postgres -> postgres is used as a persistence strategy. This is currently optional, but will be used in the embeddings strategy. 
2. Example: `.config 'code' 'true'` 

Docker notes
 docker run --name chat-postgres -e POSTGRES_PASSWORD=BigBlockRed15! -p 5432:5432 --rm -d ankane/pgvector

npx typeorm-ts-node-esm migration:generate ./src/migration/update-post-table -d ./src/data-source.ts

