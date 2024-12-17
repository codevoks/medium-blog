import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
//import { SignupInput,SigninInput } from '@100xdevs/medium-common'
//import { SignupInput,SigninInput } from '@codevoks/medium-common-global'
import { SignUpInput,SignInInput } from '../../../common/dist/index'

const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_TOKEN : string,
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const parsePayLoad = SignUpInput.safeParse(body);
    if(!parsePayLoad.success){
      c.status(400);
      return c.json({
        message: "Invalid Inputs"
      })
    }
  
    try{
      const body = await c.req.json();
  
      const user = await prisma.user.create({
        data : {
          email: body.email,
          password: body.password,
        },
      })
  
      const secret = c.env.JWT_TOKEN;
      const token = await sign({ID:user.id},secret);
  
      c.status(200);
      return c.json({
        token: token,
        message: "User signed up successfully"
      })
    }catch(e){
      c.status(403);
      return c.json({
        error: "User sign up failed"
      })
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const parsePayLoad = SignInInput.safeParse(body);
    if(!parsePayLoad.success){
      c.status(400);
      return c.json({
        message: "Invalid Inputs"
      })
    }
    try{
      const user = await prisma.user.findFirst({
        where: {
          email: body.email
        }
      })
      if(!user){
        c.status(403);
        return c.json({
          error: "User not found"
        });
      }
      const token = await sign({userID:user.id},c.env.JWT_TOKEN);
      c.status(200);
      return c.json({
        token:token,
        message: "User signed in successfully"
      })
    }catch(e){
      c.status(403);
      return c.json({
        error: "Trouble signing in"
      })
    }
  })

export default userRouter