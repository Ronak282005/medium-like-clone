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
blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";

    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        console.log("Decoded User:", user);

        if (typeof user === "object" && user !== null && "id" in user && typeof user.id === "string") {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({ message: "Invalid token payload" });
        }
    } catch (e) {
        console.error("JWT Verification Error:", e);
        c.status(403);
        return c.json({ message: "You are not logged in" });
    }
});




// blog routes post
blogRouter.post("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    
    if (!success) {
        c.status(400);
        return c.json({ error: "Invalid input" });
    }

    const authorId = c.get("userId"); 
    console.log("Author ID:", authorId); 

    if (typeof authorId !== "string") {
        c.status(400);
        return c.json({ error: "Invalid author ID" });
    }

    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
            },
        });

        return c.json({
            id : blog.id
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        c.status(500);
        return c.json({ error: "Failed to create blog" });
    }
});



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
    
    const blogs = await prisma.post.findMany({
        select:{
            content : true,
            title : true,
            id : true,
            author : {
                select : {
                    name : true
                    }
            },
        }
    })
    
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
            },
            select:{
                content : true,
                title : true,
                id : true,
                author : {
                    select : {
                        name : true
                    }
                }
            }
        })
        
        return c.json({blog})
    }catch(e){
        c.status(404)
        return c.json({message : "error while fetching blog"})
    }
    
})