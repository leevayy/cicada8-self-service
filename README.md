# Cicada Self Service

This is monorepo for the Cicada Self Service project, which includes two microservices and a frontend.

## Design

Дизайн + Преза (слева сверху вторая вкладка)

https://www.figma.com/design/ZjgrAUzHLEW9RihtAM8mja/%D0%A5%D0%B0%D0%BA%D0%B0%D1%82%D0%BE%D0%BD?node-id=0-1&t=poT2jZpWidaiUl0W-1

## Backend

### cicada_user_auth

This is a Go backend service that handles user authorization with machine-readable proxy and signing. It integrates with the Dropbox Sign API.

To run this service, navigate to its directory and use the following command:

```bash
go run main.go
```

### cicada-sc-pdf-builder

This is a Node.js service written in JavaScript and uses Koa and pdf-lib to build PDF documents for signing based on user data.

To run this service, navigate to its directory and use the following commands:

```bash
npm install
npm start
```

## Frontend

### cicada8-self-service

This is a React + TypeScript frontend that ties everything together.

To run the frontend, navigate to its directory and use the following commands:

```bash
npm install
npm run build
npm run preview
```

License

[MIT](https://choosealicense.com/licenses/mit/)

