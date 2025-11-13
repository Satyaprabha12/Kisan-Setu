import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PiGrainsDuotone } from "react-icons/pi";
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/farmerSlice';
import { ClipLoader } from 'react-spinners';
function AddItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.farmer)
    const [loading,setLoading]=useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
     const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState("kg")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("veg")
    const categories = ["Vegetables",
        "Fruits",
        "Dairy",
        "Grain",
        "Meat",
        "others"]

        const units = ["kg", "g", "l", "ml", "piece", "dozen", "quintal"]

    const dispatch = useDispatch()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

         if (!name || !category || !price) {
        alert('Please fill all required fields')
        return
    }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("category",category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            formData.append("quantity", quantity)
            formData.append("unit", unit)
            if (backendImage) {
                formData.append("image", backendImage)
            }

            console.log('Sending item data...')

            const result = await axios.post(`${serverUrl}/api/item/add-item`, 
                formData, { withCredentials: true,
                     headers: {
                    'Content-Type': 'multipart/form-data'}})
                console.log('Item added:', result.data)

            dispatch(setMyShopData(result.data))
            alert('Item added successfully! 🎉')
            
           setLoading(false)
           navigate("/")
        } catch (error) {
            console.log(error)
            console.error('❌ Response:', error.response?.data)
        
        const errorMessage = error.response?.data?.message || 'Failed to add item'
        alert(errorMessage)
    } finally {
        setLoading(false)
        }
    }
    return (
        <div className='flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-5 left-5 z-2.5 mb-2.5' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>

            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <PiGrainsDuotone className='text-[#ff4d2d] w-16 h-16' />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">
                        Add Food
                    </div>
                </div>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input type="text" placeholder='Enter Food Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type="file" accept='image/*' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={handleImage} />
                        {frontendImage && <div className='mt-4'>
                            <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border' />
                        </div>}

                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                        <input type="number" placeholder='0' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder='0' 
                                min="0"
                                step="0.01"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder='0' 
                                min="0"
                                step="0.01"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                onChange={(e) => setQuantity(e.target.value)}
                                value={quantity}
                                required
                            />
                        </div>
                    </div>

                    {/* Unit */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Unit</label>
                        <select 
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setUnit(e.target.value)}
                            value={unit}
                        >
                            {units.map((u, index) => (
                                <option value={u} key={index}>{u}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                        <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}

                        >
                            <option value="">select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}

                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                        <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setFoodType(e.target.value)}
                            value={foodType}

                        >
                            <option value="veg" >veg</option>
                            <option value="non veg" >non veg</option>




                        </select>
                    </div>

                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer' disabled={loading}>
                      {loading?<ClipLoader size={20} color='white' />:"Save"}
                    </button>
                </form>
            </div>



        </div>
    )
}

export default AddItem
