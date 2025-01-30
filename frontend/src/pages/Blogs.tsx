import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks"

export const Blogs = () => {
  const {loading, blogs} = useBlogs()
  console.log(blogs);
  
  if(loading){
      return <div className="flex justify-center">Loading...</div>
  }
  return (
    <div>
      <Appbar/>
      <div className="flex justify-center">
          <div>
            {blogs.map(blog => (
              <BlogCard authorName={blog.author.name} title={blog.title} content={blog.content} id={blog.id} publishedDate="2 Feb 2025" />
            ))}
          </div>
      </div>
    </div>
  )
}

