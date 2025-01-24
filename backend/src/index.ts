import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
  // return c.text('Hello Hono!')
})

app.post("/api/v1/signup",(c)=>{
  return c.json({message: "signup"})
})
app.post("/api/v1/signin",(c)=>{
  return c.json({message: "signin"})
})
app.post("/api/v1/blog",(c)=>{
  return c.json({message: "Blogs post"})
})
app.put("/api/v1/blog",(c)=>{
  return c.json({message: "Blogs put"})
})
app.get("/api/v1/blog/:id",(c)=>{
  return c.json({message: "Blogs get"})
})

export default app
