import { Route, Routes } from "react-router-dom"
import SignIn from "./pages/signIn"
import SignUp from "./pages/signUp"
import { useGetCurrentUser } from "./hooks/useGetCurrentUser"
import  useGetCity  from "./hooks/useGetCity"
import { useGetMyShop } from "./hooks/useGetMyShop"
import { useSelector, useDispatch } from "react-redux"
import Home from "./pages/home"
import { Navigate } from "react-router-dom"
import CreateEditShop from './pages/createEditShop'
import AddItem from "./pages/addItems"
import EditItem from "./pages/editItem"
import useGetShopByCity from "./hooks/useGetShopByCity"
import useGetItemsByCity from "./hooks/useGetItemsByCity"
import CartPage from "./pages/cartPage"
import CheckOut from "./pages/checkOut"
import OrderPlaced from "./pages/orderPlaced"
import MyOrders from "./pages/myOrders"
import useGetMyOrders from "./hooks/useGetMyOrders"
import Shop from './pages/shop'
import axios from "axios"
import { setNewOrdersCount } from "./redux/farmerSlice"
import { useEffect } from "react"

axios.defaults.withCredentials = true


export const serverUrl = "https://kisan-setu-backend-9x9d.onrender.com"

function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const { myShopData } = useSelector(state => state.farmer)

  useEffect(() => {
    const fetchOrdersCount = async () => {
      
      if (userData?.user?.role === 'farmer' && myShopData) {
        try {
          const result = await axios.get(
            `${serverUrl}/api/order/farmer/new-orders-count`,
            { withCredentials: true }
          )
          dispatch(setNewOrdersCount(result.data.count))
        } catch (error) {
          console.error('Failed to fetch orders count:', error)
        }
      }
    }

    fetchOrdersCount()

    const interval = setInterval(fetchOrdersCount, 30000)

    return () => clearInterval(interval)
  }, [userData, myShopData, dispatch])

  return (
    <Routes>
     <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
     <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
     <Route path="/login" element={!userData ? <SignIn /> : <Navigate to="/" />} />
     <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
     <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
     <Route path='/add-item' element={userData?<AddItem/>:<Navigate to={"/signin"}/>}/>
     <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
     <Route path='/cart' element={userData?<CartPage/>:<Navigate to={"/signin"}/>}/>
     <Route path='/checkout' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>}/>
     <Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>}/>
     <Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>}/>
     <Route path='/shop/:shopId' element={userData?<Shop/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}
export default App
