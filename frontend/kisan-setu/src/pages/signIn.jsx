import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

function SignIn() {

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch=useDispatch()

    const handleSignIn = async () => {
     try {
        const result = await axios.post(`${serverUrl}/api/auth/signin`, {
          email,
          password,
        }, { withCredentials: true })
        console.log("Sign in successful:", result.data)
        dispatch(setUserData(result.data))
     } catch (error) {
  if (error.response) {
    console.log("Server responded with:", error.response.data);
  } else {
    console.log("Error:", error);
  }
}

    }

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-orange-400 via-white to-green-400 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-[600px] text-center border border-white/40">
        <h1 className="text-6xl font-extrabold font-serif bg-linear-to-r from-orange-500 to-green-500 text-transparent bg-clip-text drop-shadow-md">Kisan Setu</h1>
        <p className="text-gray-500 mt-2 mb-8 text-lg font-medium">Join Kisan Setu today and connect directly with farmers.</p>
      <div className="text-left mt-8 space-y-6">
      <label className="block font-serif text-gray-700 text-2xl font-medium mb-1">Email</label>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter your Email"className="w-full bg-transparent border-b-2 border-gray-400 focus:border-green-500 outline-none py-2 transition-all duration-300 placeholder-gray-400"/>
      <label className="block font-serif text-gray-700 text-2xl font-medium mb-1">Password</label>
      <div className="relative">
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} placeholder="Enter your Password" autoComplete="new-password" className="w-full bg-transparent border-b-2 border-gray-400 focus:border-green-500 outline-none py-2 transition-all duration-300 placeholder-gray-400"/>
      <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-2  text-gray-600 hover:text-green-600 transition-colors cursor-pointer">{!showPassword?<FaEye />:<FaEyeSlash />}</button>
      </div>
      <button onClick={handleSignIn} className="w-full mt-4 font-serif flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 border rounded-lg hover:bg-green-600 transition-colors cursor-pointer">Log In</button>
      <p className="text-center" onClick={()=>navigate("/signup")}>Wanna create a new account? <span className="text-green-500 hover:underline cursor-pointer">Sign Up</span></p>
    </div>
    </div>
    </div>
  )
}

export default SignIn
