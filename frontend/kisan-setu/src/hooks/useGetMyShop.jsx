import { useEffect } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setMyShopData } from "../redux/farmerSlice"
import { useSelector } from "react-redux"

export const useGetMyShop = () => {
    const dispatch=useDispatch()
    const { userData } = useSelector((state) => state.user);

  useEffect(()=>{

    if (userData?.user?.role !== "farmer") return;
    
    let isMounted = true;

    const fetchShop = async()=> {
        try {
           const result = await axios.get(`${serverUrl}/api/shop/my-shop`,
            { withCredentials: true })

        console.log("My shop Data", result.data) 

        if (isMounted) dispatch(setMyShopData(result.data));

        } catch (error) {
            console.error("Error fetching shop data:", error)
        }
    }
    fetchShop()

    return () => {
      isMounted = false;
    };

  },[userData,dispatch])
}

