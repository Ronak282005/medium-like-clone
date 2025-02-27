import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput,signinInput } from "@ronak3333/medium-common"

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string
      JWT_SECRET : string
    }
  }>();

// signup route
userRouter.post("/signup",async (c)=>{
  
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json()
    const {success} = signupInput.safeParse(body)
    if(!success){
      c.status(400)
      return c.json({error : "Invalid input"})
    }
    try {
      const user = await prisma.user.create({
        data:{
          email : body.email,
          password : body.password,
          name : body.name
        }
      })
      
      const jwt = await sign({id : user.id},c.env.JWT_SECRET)

      return c.json(jwt)
      
    } catch (error) {
      c.status(403)
      return c.json({message: "User already exists/error while creating user"})
    }
  })
  
  // signin route
  userRouter.post("/signin",async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json()
    const {success} = signinInput.safeParse(body)
    if(!success){
      c.status(400)
      return c.json({error : "Invalid input"})
    }
    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })
    if(!user){
      c.status(403)
      return c.json({error : "user not found"})
    }
    
    const jwt = await sign({id : user.id},c.env.JWT_SECRET)
    return c.json(jwt)
  })