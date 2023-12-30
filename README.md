# movies.wowellworld.com
[![App Engine Build](https://github.com/JHWelch/movies.wowellworld.com/actions/workflows/deploy-to-app-engine.yml/badge.svg)](https://github.com/JHWelch/movies.wowellworld.com/deployments)
[![Quality Checks](https://github.com/JHWelch/movies.wowellworld.com/actions/workflows/qc-check.yml/badge.svg)](https://github.com/JHWelch/movies.wowellworld.com/actions/workflows/qc-check.yml)

An integration with [Notion](https://notion.so) to display weekly movie nights using a Notion database as the source of truth.

## Development

### .env

```sh
cp .env.example .env
```

Update `.env` to match Notion database.

### Build for Development

To build assets for development and serve on port `PORT`.

```sh
npm run dev
```

### Linting & Fixing

```sh
npm run lint
```

```sh
npm run fix
```

### Repository Structure

This application is split into two parts:

- `server` - The Express server that serves the application and handles API requests.
- `client` - The Vue application served by the Express server that handles the UI.

Each part has its own `package.json` and `node_modules` directory, however both can be installed with a single `npm install` command.

## Deploy to App Engine

This app is deployed to Google App Engine. It will automatically deploy on all merges to `main.` This is the preferred method of deployment.

App engine will build the application with `npm run build` and serve the application with `npm run start`.

Manual deployments can be performed with the built in script.

You must first have a copy of `.env.production` in the root directory. Then run:

```sh
sh scripts/deploy.sh
```

## Technologies

- [EJS](https://ejs.co/)
- [Express](https://expressjs.com/)
- [Google App Engine](https://cloud.google.com/appengine)
- [Google Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Notion JS SDK](https://github.com/makenotion/notion-sdk-js)
- [Tailwind CSS](https://tailwindcss.com/)
- [TMDB](https://developer.themoviedb.org/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue](https://vuejs.org/)
