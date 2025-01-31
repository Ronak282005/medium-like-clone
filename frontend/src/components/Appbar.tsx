import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between items-center px-10 py-4">
        <Link to={"/"}>
          <div className="flex flex-col justify-center">
              Medium
          </div>
        </Link>
        <Avatar name="ronak" size="big"/>
    </div>
  )
}
