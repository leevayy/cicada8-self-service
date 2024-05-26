import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import pgPromise from 'pg-promise';
import getPdfAuthorizingLetter from './getPdfAuthorizingLetter.js';

const run = async () => {
    // Set up Koa app
    const app = new Koa();
    const router = new Router();
    app.use(bodyParser());

    // Database connection settings
    const pgp = pgPromise();
    const db = pgp({
        host: 'db', // Use the service name defined in the Docker Compose file
        port: 5432,
        database: 'your_database',
        user: 'your_user',
        password: 'your_password'
    });

    router.post('/api/getAuthMail', async (ctx) => {
        try {
            const letter = { id: crypto.randomUUID(), content: await getPdfAuthorizingLetter(ctx.request.body) };

            // await db.none('INSERT INTO letters(id, letter) VALUES($1, $2)', [letter.id, JSON.stringify(letter)]);

            ctx.body = { status: 'success', letter };
        } catch (error) {
            console.error(error);
            ctx.status = 500;
            ctx.body = { status: 'error', message: error.message };
        }
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default run;
