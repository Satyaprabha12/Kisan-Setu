import { useEffect } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

export const useGetCurrentUser = () => {
    const dispatch=useDispatch()

  useEffect(()=>{
    const fetchUser = async()=> {
        try {
           const result = await axios.get(`${serverUrl}/api/user/current`,
            { withCredentials: true })
        console.log("Current User:", result.data) 
        dispatch(setUserData(result.data))
        } catch (error) {
            console.error("Error fetching current user:", error)
        }
    }
    fetchUser()
  },[])
}

