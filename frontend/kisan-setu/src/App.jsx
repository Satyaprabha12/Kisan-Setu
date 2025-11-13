import { Route, Routes } from "react-router-dom"
import SignIn from "./pages/signIn"
import SignUp from "./pages/signUp"
import { useGetCurrentUser } from "./hooks/useGetCurrentUser"
import  useGetCity  from "./hooks/useGetCity"
import { useGetMyShop } from "./hooks/useGetMyShop"
import { useSelector } from "react-redux"
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


export const serverUrl = "http://localhost:8000"


function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  const {userData} = useSelector(state=> state.user)
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
