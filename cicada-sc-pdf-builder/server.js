import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import getPdfAuthorizingLetter from './getPdfAuthorizingLetter.js';

const run = async () => {
    const app = new Koa();
    const router = new Router();
    app.use(bodyParser());
    const corsOptions = {
        origin: 'http://localhost:4173', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'], 
        credentials: true, 
        maxAge: 300, 
    };
    
    app.use(cors(corsOptions));

    router.post('/api/getAuthMail', async (ctx) => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        try {
            const letter = { id: crypto.randomUUID(), content: await getPdfAuthorizingLetter({
                ...ctx.request.body,
                letterNumber: crypto.randomUUID(),
                currentDate: `${day}.${month}.${year}`,
                endPeriodDate: '31.12.2024',
            }) };

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
