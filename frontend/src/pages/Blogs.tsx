import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import CardSkeleton from "../components/CardSkeleton"
import HeaderSkeleton from "../components/HeaderSkeleton"
import { useBlogs } from "../hooks"

export const Blogs = () => {
  const {loading, blogs} = useBlogs()
  console.log(blogs);
  
  if(loading){
      return <div>
        <HeaderSkeleton/>
        <div className="flex flex-col justify-center items-center space-y-4">
          <CardSkeleton/>
          <CardSkeleton/>
          <CardSkeleton/>
          <CardSkeleton/>
          <CardSkeleton/>
        </div>
      </div>
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

