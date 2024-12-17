import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
//import { SignupInput,SigninInput } from '@100xdevs/medium-common'
import { SignupInput,SigninInput } from '@codevoks/test'


const postRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_TOKEN : string;
    },
    Variables : {
        userID : string;
    }
}>();

postRouter.use('/*',async (c, next)=>{
    const authHeader = c.req.header("authorization")||"";
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        c.status(403);
        return c.json({
            error: "Authorization is blanck or does not starts with Bearer"
        })
    }
    const token = authHeader.split(" ")[1];
    const user = await verify(authHeader,c.env.JWT_TOKEN);
    if(user){
        c.set("userID",user.ID as string);
        await next();
    }else{
        c.status(403);
        return c.json({
            error: "You are not logged in"
        })
    }
    next();
});

postRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
      const parsePayLoad = CreatePostInput.safeParse(body);
      if(!parsePayLoad.success){
        c.status(411);
        return c.json({
            message: "Invalid Inputs"
        })
    }
      try{
        prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: "1"
            }
        })
        c.status(200);
        return c.json({
            message: "Post created"
        })
      }catch(e){
        c.status(403);
        return c.json({
            error: "Could not create blog"
        })
      }
  })
  
postRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
      const parsePayLoad = UpdatePostInput.safeParse(body);
      if(!parsePayLoad.success){
        c.status(411);
        return c.json({
            message: "Invalid Inputs"
        })
    }
      try{
        const post = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content
            }
        })
        c.status(200);
        return c.json({
            message: "Post updated",
            post : post
        })
      }catch(e){
        c.status(403);
        return c.json({
            error: "Could not update blog"
        })
    }
  })
  
postRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try{
        const userID = c.req.query('id');
        const post = await prisma.post.findUnique({
            where: {
                id: userID
            }
        })
        c.status(200);
        return c.json({
            message: "Post found",
            post: post
        })
      }catch(e){
        c.status(403);
        return c.json({
            error: "Could not find blog"
        })
    }
  })
  
postRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try{
        const post = await prisma.post.findMany();
        c.status(200);
        return c.json({
            message: "Posts found",
            post: post
        })
      }catch(e){
        c.status(403);
        return c.json({
            error: "Could not find blog"
        })
    }
  })

export default postRouter