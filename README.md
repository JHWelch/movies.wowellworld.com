# Notion Movie Page Generator

An integration with [Notion](https://notion.so) to serve a specific database as a webpage.

## Deploy to App Engine
```sh
sh scripts/deploy.sh
```

## Development

### .env

```sh
cp .env.example .env
```

Update `.env` to match database.

### Build for Development
To build assets for development and serve on port `PORT`.

```sh
npm run watch
```

### Linting & Fixing

```sh
npm run lint

npm run fix
```

## Technologies
- [Express](https://expressjs.com/)
- [Notion JS SDK](https://github.com/makenotion/notion-sdk-js)
- [Google App Engine](https://cloud.google.com/appengine)
- [EJS](https://ejs.co/)
- [Tailwind CSS](https://tailwindcss.com/)
