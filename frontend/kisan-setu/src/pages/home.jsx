import { useSelector } from "react-redux"
import UserDashboard from "../components/userDashboard"
import OwnerDashboard from "../components/ownerDashboard"
import Nav from "../components/nav.jsx"


function Home() {

    const {userData} = useSelector(state=> state.user)
    


  return (
    <div className="w-full min-h-screen pt-[100px] flex flex-col items-center bg-linear-to-r from-orange-400 via-white to-green-400">
        <Nav />
        {userData?.user?.role==="user"&& <UserDashboard />}
        {userData?.user?.role==="farmer"&& <OwnerDashboard />}
    </div>
  )
}

export default Home
