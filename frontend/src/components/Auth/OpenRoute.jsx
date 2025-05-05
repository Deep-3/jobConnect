// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { User } = useSelector((state) => state.auth)

  if (User === null) {
    return children
  } else {
    return <Navigate to="/"/>
  }
}

export default OpenRoute;