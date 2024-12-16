import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_TOKEN: string,
  }
}>();

app.get('/', (c) => {
  return c.text('Welcome to Blogging App')
})

app.route('/api/v1/user',userRouter);
app.route('/api/v1/blog',postRouter);



export default app
