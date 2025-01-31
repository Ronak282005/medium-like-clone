import { useParams } from "react-router-dom"
import { FullBlog } from "../components/FullBlog"
import { useBlog } from "../hooks"
import BlogSkeleton from "../components/BlogSkeleton"
import HeaderSkeleton from "../components/HeaderSkeleton"

export const Blog = () => {
  const {id} = useParams()
  const {loading,blog} = useBlog({
    id : id || ""
  })
  if(loading) return <div>
    <HeaderSkeleton/>
    <BlogSkeleton />
  </div>
  return (
    <div>
      {blog ? <FullBlog blog={blog}/> : <div>No blog found</div>}
    </div>
  )
}
