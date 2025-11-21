import logo from "../assets/logo.png"
import { IoLocation } from "react-icons/io5"
import { IoMdSearch } from "react-icons/io"
import { IoCartOutline } from "react-icons/io5"
import { useSelector } from "react-redux"
import { useState } from "react"
import { RxCross2 } from "react-icons/rx"
import { serverUrl }  from "../config"
import { setUserData, setSearchItems } from "../redux/userSlice"
import axios from "axios"
import { useDispatch } from "react-redux"
import { FaPlus } from "react-icons/fa"
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom"

function Nav() {

  const { userData, currentCity} = useSelector(state=>state.user)
  const searchItems = useSelector(state => state.user.searchItems)
  const cartItems = useSelector(state => state.user.cartItems)
  const {myShopData}=useSelector(state=>state.farmer)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState("")
  const dispatch=useDispatch()

  const handleSearch = async () => {
  console.log("Search triggered for query:", query)

  if (!query.trim()) {
    dispatch(setSearchItems([]))
    return
  }

  try {
    const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, 
      console.log("serverUrl =", serverUrl),
      { withCredentials: true }
    )

    const data = Array.isArray(result.data) ? result.data : (result.data ? [result.data] : [])
    dispatch(setSearchItems(data))
  } catch (error) {
    console.error("Search failed:", error)
    dispatch(setSearchItems([]))
  }
}
  const navigate = useNavigate()

  const handleLogout=async()=>{
    try {
      const results=await axios.get(`${serverUrl}/api/auth/signout`,
        {withCredentials:true})
        dispatch(setUserData(null))
    } catch (error) {
      console.log("Error logging out:", error)
    }

  }

  return (
    <div className='w-full h-20 flex items-center justify-between gap-8 px-5 fixed top-0 z-99999 bg-white/50 overflow-visible'>
      {showSearch && userData?.user?.role==="user" &&  <div className="flex fixed w-[90%] h-[60px] top-18 left-[5%] bg-white shadow-xl rounded-lg items-center gap-5">
            <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-3 border-r-2 border-gray-200 h-full">
            <IoLocation className="text-2xl text-orange-500" /><div className="text-xl truncate text-gray-600">{currentCity || "Unknown"}</div>
            </div>
            <div className="flex items-center gap-1 px-3 h-full w-[80%]">
            <IoMdSearch size={20} className="text-orange-500" />
            <input type="text" placeholder="Search Groceries..." className="px-2 outline-0 w-full" value={query} onChange={(e)=> setQuery(e.target.value)}/>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg" onClick={handleSearch} type="button">Search</button>
            </div>
            </div>}

        <div className="flex items-center gap-1 h-full">
           <img src={logo} alt="Kisan Setu Logo" className="h-full w-auto object-contain" />
        <h1 className="text-3xl font-extrabold font-serif bg-linear-to-r from-orange-500 to-green-500 text-transparent bg-clip-text drop-shadow-md uppercase">Kisan Setu</h1> 
        </div>
        {userData?.user?.role==="user" && <div className=" md:flex hidden md:w-[70%] lg:w-[40%] h-[60px] bg-white shadow-xl rounded-lg items-center gap-5">
            <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-3 border-r-2 border-gray-200 h-full">
            <IoLocation className="text-2xl text-orange-500" /><div className="text-xl truncate text-gray-600">{currentCity || "Unknown"}</div>
            </div>
            <div className="flex items-center gap-1 px-3 h-full w-[80%]">
            <IoMdSearch size={20} className="text-orange-500" />
            <input type="text" placeholder="Search Groceries..." className="px-2 outline-0 w-full" value={query} onChange={(e)=> setQuery(e.target.value)}/>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg" onClick={handleSearch} type="button">Search</button>
            </div>
            </div>}
        
            <div className="flex items-center gap-4">
              {userData?.user?.role==="user" && (showSearch ? <RxCross2 size={30} onClick={()=>setShowSearch(false)} className="text-orange-500 md:hidden"/> : <IoMdSearch size={30} className="text-orange-500 md:hidden" onClick={()=>setShowSearch(true)} />)}
              
              {userData?.user?.role === "farmer" && myShopData && ( <>
             <button className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-white/50 text-orange-400"
             onClick={()=>navigate("/add-item")}>
              <FaPlus size={20} />
              <span>Add Groceries</span>
              </button>
              <button className="md:hidden flex items-center gap-1 p-2 cursor-pointer rounded-full bg-white/50 text-orange-400"
              onClick={()=>navigate("/add-item")}>
              <FaPlus size={20} />
              </button>
              </>)}
              {userData?.user?.role==="farmer" && (<>
              <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-white/50 text-orange-400 font-medium"
              onClick={()=>navigate("/my-orders")}>
              <TbReceipt2 size={20}/>
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-orange-400 rounded-full px-1.5 py-px">0</span>
              </div>
              <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-white/50 text-orange-400 font-medium"
              onClick={()=>navigate("/my-orders")}>
              <TbReceipt2 size={20}/>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-orange-400 rounded-full px-1.5 py-px">0</span>
              </div>
              </>)}
              

              {userData?.user?.role==="user" &&  <div className="relative flex gap-1 cursor-pointer" onClick={()=>navigate("/cart")}>
            <IoCartOutline size={35} className=" text-orange-500 mr-3 cursor-pointer" />
            <span className="absolute lg:right-1 right-1 -top-3 text-gray-500">{cartItems.length}</span>
            </div>}
             
            <div className="relative flex gap-1 cursor-pointer">
            <button className="hidden md:block px-3 py-1 rounded-lg bg-white/50 text-orange-500 text-sm font-medium cursor-pointer"
            onClick={()=>navigate("/my-orders")}>View Cart</button>
            <div onClick={()=>setShowInfo(prev => !prev)} className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-400 text-white text-[18px] shadow-xl font-semibold cursor-pointer uppercase">
              {userData?.user?.fullName?.slice(0,1) || "?"}
            </div>
            {showInfo && <div className="fixed top-18 right-3 md:right-[10%] lg:right-[2%] w-[180px] bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-3 z-9999">
              <div className="text-lg font-semibold">{userData?.user?.fullName || "Guest"}</div>
              <div className="md:hidden font-semibold cursor-pointer text-orange-400"
              onClick={()=>navigate("/my-orders")}>View Cart</div>
              <div className="text-sm text-gray-500 cursor-pointer" onClick={handleLogout}>Log Out</div>
            </div>}
            </div>
            </div>
            
        
    </div>
  )
}

export default Nav
