import { Hono } from "hono";
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createBlogInput,updateBlogInput } from "@ronak3333/medium-common";


export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string
      JWT_SECRET : string
    },
    Variables:{
        userId : string
    }
  }>();


// auth middleware
blogRouter.use("/*",async (c,next)=>{
    try{
        const authorization = c.req.header('authorization')
        if(!authorization){
          c.status(403)
          return c.json({message: "Unauthorized"})
        }
        const token = authorization.split(" ")[1]
        const user = await verify(token,c.env.JWT_SECRET)
        if(user){
            c.set("userId" , (user as { id: string }).id)
            await next()
        }else{
          c.status(403)
          return c.json({message: "Unauthorized"})
        }
    }catch(e){
        c.status(403)
        return c.json({error: e})
    }
  })


// blog routes post
blogRouter.post("/",async(c)=>{
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
        
    const body = await c.req.json()
    const {success} = createBlogInput.safeParse(body)
    if(!success){
        c.status(400)
        return c.json({error : "Invalid input"})
    }
    const authorId = c.get("userId")
    
    const blog = await prisma.post.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })
    return c.json({id : blog.id})
})


// blog routes put
blogRouter.put("/",async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json()
    const {success} = updateBlogInput.safeParse(body)
    if(!success){
        c.status(400)
        return c.json({error : "Invalid input"})
    }
    const authorId = c.get("userId")
    
    const blog = await prisma.post.update({
        where : {
            id : body.id
        },
        data : {
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })
    
    return c.json({id : blog.id})
})

// todo : to add pagination
blogRouter.get("/bulk",async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blogs = await prisma.post.findMany()
    
    return c.json<{ blogs: typeof blogs }>({ blogs })
})



// blog routes get
blogRouter.get("/:id",async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param("id")
    try {
        const blog = await prisma.post.findFirst({
            where : {
                id : id
            }
        })
        
        return c.json({blog})
    }catch(e){
        c.status(404)
        return c.json({message : "error while fetching blog"})
    }
    
})