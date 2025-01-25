import { Hono } from "hono";
import { sign, verify } from 'hono/jwt'


export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string
      JWT_SECRET : string
    }
  }>();


// auth middleware
blogRouter.use("/*",async (c,next)=>{
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
blogRouter.post("/",async(c)=>{
    return c.json({message: "Blogs post"})
})
  
  
  // blog routes put
blogRouter.put("/",async(c)=>{
    return c.json({message: "Blogs put"})
})
  
  
// blog routes get
blogRouter.get("/",async(c)=>{
    return c.json({message: "Blogs get"})
})


blogRouter.get("/bulk",async(c)=>{
    return c.json({message: "Blogs get"})
})

