# astroanax's CRUD api for a blogging website

## features
- CRUD for user
- CRUD for blog
- CRUD for comments (one to many?? relationship)
- users follow feature (many to many?? relationship)
- aggregation pipelines
- jwt authentication 
- cli for managing blogs

## development details
### rant
Coming from FastAPI and SQLAlchemy, Express+Mongoose(with TypeScript, even, ugh) is a PITA :(. The whole javascript experience, 2 space default formatting, etc, especially as some who uses a default vim config with less than 5 lines.

The docs felt incomplete, even with the vast majority of users, so did the dev experience. And there is this hype around the incompetent "MERN" stack for God knows what reason.

Express doesn't have request or response validation (-10000 aura). why? can't say speed or some other reason because according to [this](https://www.techempower.com/benchmarks/#hw=ph&test=fortune&section=data-r22) benchmark, express-mongodb stands at 365, while fastapi-uvicorn stands at 306. Ha

And mongodb/mongoose is weird, just to reiterate, has bad docs. SQLAlchemy seemed so much better documented. Hooks and their behaviour are practically [undocumented](https://mongoosejs.com/docs/search.html?q=pre). also no relationships 💔

[deno](https://deno.com) on the other hand, was a breath of fresh air. built in sane support for http requests. I used it to create the bloggingapi-cli, with [cliffy](https://github.com/c4spar/deno-cliffy). maybe migrating both express and mongoose to it will be a nice task
### actual details

this is actually a fork/boilerplate enhancement of an existing repo i found on a [youtube video](https://www.youtube.com/watch?v=WQWw1-IV4io) which got 3k views. i thought typescript will be nice coz why not. (actually kinda stamped myself in the foot with that) 

since i am used to python, i thought decorators would make some excellent syntatic sugar, so i indulged in it, and used it throughout all code i implemented.

The project originally used [joi](https://joi.dev/) for validation, which actually wasn't implemented, but just left as an unfinished decorator. I switched to [zod](https://zod.dev/) 🥰  because they said its [better](https://zod.dev/?id=comparison).

For jwt authentication - i used auth0's libraries - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken/) and [express-jwt](https://github.com/auth0/express-jwt), the latter to handle the middleware for me.

Relationships - they aren't really relationships. orphan nodes cascade on delete

the pipelines are pretty basic - rn there are 3 of them - 
- to get all activity of a user (posts, comments)
- to get total follower+following count of a user
- to get the top users (by followers)

the cli is also very basic - create, read, delete. there is already an API, so meh.

there is a [TODO](./TODO) with some unfinished work. if i do actually finish it, you won't see this line :)

### to run

before running, take a look at [src/config/config.ts](./src/config/config.ts) to set the appropiate env vars in the '.env' file. I self hosted mongodb, so configure appropriately.

I use pnpm, but should work regardless -

- `pnpm install` to install dependencies
- `pnpm start` to start the server
- `pnpm format` to format (via prettier)

### the cli

`deno run --allow-read --allow-net src/cli/main.ts login` to login

`deno run --allow-read --allow-net src/cli/main.ts blogs create` to create a new blog post

`deno run --allow-read --allow-net src/cli/main.ts blogs get -i 66e6d3f5f301744b043ff8e7` to get a blog post by its id

`deno run --allow-read --allow-net src/cli/main.ts blogs delete -i 66e6d3f5f301744b043ff8e7` to delete a blog post by its id

deno, being so secure, needs those flags.
