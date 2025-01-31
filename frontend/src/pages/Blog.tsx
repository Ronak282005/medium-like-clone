import { useParams } from "react-router-dom"
import { FullBlog } from "../components/FullBlog"
import { useBlog } from "../hooks"

export const Blog = () => {
  const {id} = useParams()
  const {loading,blog} = useBlog({
    id : id || ""
  })
  if(loading) return <div>Loading...</div>
  return (
    <div>
      {blog ? <FullBlog blog={blog}/> : <div>No blog found</div>}
    </div>
  )
}
