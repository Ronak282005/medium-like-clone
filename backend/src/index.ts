import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string
    JWT_SECRET : string
  }
}>()


app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)


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
