import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string
    JWT_SECRET : string
  }
}>()

// auth middleware
app.use("/api/v1/blog/*",async (c,next)=>{
  const authorization = c.req.header('authorization')
  if(!authorization){
    c.status(403)
    return c.json({message: "Unauthorized"})
  }
  const token = authorization.split(" ")[1]
  const jwt = await verify(token,c.env.JWT_SECRET)
  if(jwt.id){
    next()
  }else{
    c.status(403)
    return c.json({message: "Unauthorized"})
  }
})

// signup route
app.post("/api/v1/signup",async (c)=>{
  
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json()
  try {
    const user = await prisma.user.create({
      data:{
        email : body.email,
        password : body.password,
        name : body.name
      }
    })
    
    const token = await sign({id : user},c.env.JWT_SECRET)
    
    return c.json({jwt : token})
    
  } catch (error) {
    c.status(403)
    return c.json({message: "User already exists/error while creating user"})
  }
})

// signin route
app.post("/api/v1/signin",async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  const user = await prisma.user.findFirst({
    where: {
      email: body.email
    }
  })
  if(!user){
    c.status(403)
    return c.json({error : "user not found"})
  }

  const jwt = sign({id : user},c.env.JWT_SECRET)
  return c.json({jwt})
})


// blog routes post
app.post("/api/v1/blog",(c)=>{
  return c.json({message: "Blogs post"})
})


// blog routes put
app.put("/api/v1/blog",(c)=>{
  return c.json({message: "Blogs put"})
})


// blog routes get
app.get("/api/v1/blog/:id",(c)=>{
  return c.json({message: "Blogs get"})
})

export default app
