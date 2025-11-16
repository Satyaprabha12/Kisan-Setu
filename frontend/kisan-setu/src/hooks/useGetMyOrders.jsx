import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice'


function useGetMyOrders() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
    if (!userData) {
            console.log("User not ready yet, skipping my-orders fetch.")
            return;
        }
        
  const fetchOrders=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
            dispatch(setMyOrders(result.data))
            console.log(result.data)
   


    } catch (error) {
        console.log(error)
    }
}
  fetchOrders()

 
  
  },[userData])
}

export default useGetMyOrders
