# National Black Justice Coalition

## Technologies

- [Next.js](https://nextjs.org/)
  - NodeJS 12.18.4
  - Yarn 1.22.5
- Typescript

## Getting Started

First install the dependencies

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the file.

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn db:migrate:create [migration-name]`

This will generate a migration file that is compatible with Typescript. Use this script when creating a new migration file.

Do NOT use `db-migrate create`

### `yarn db:update`

This will run the migrations then update Prisma. Use this script after creating your migration.

This script runs `yarn db:migrate up` then `yarn prisma:update`

### `yarn db:migrate`

This will run `db-migrate` in a Typescript environment. This replaces the standalone `db-migrate` commands. Use this script whenever you need to use `db-migrate` commands that is not `db-migrate create`.

### `yarn prisma:update`

Runs `prisma introspect` then `prisma generate`.

`prisma introspect` will read the connected database then generate a Prisma-friendly schema file.

`prisma generate` will update the client package with the previously generated Prisma-friendly schema file so that Prisma commands are now accessible for use.

### `yarn db:reset`

This will drop your database then create an empty database. Make sure to run `yarn db:update` to get your new database up to date with the migrations.

Runs `yarn db:drop` then `yarn db:create`

### `yarn db:create`

This create a database using the `pg` environment in `database.json`.

### `yarn db:drop`

This drops the database using the `pg` environment in `database.json`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
