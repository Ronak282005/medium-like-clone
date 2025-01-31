import {Blog} from "../hooks/index"
export const FullBlog = ({blog} :  {blog : Blog}) => {
  return (
    <div>{blog.title}</div>
  )
}

