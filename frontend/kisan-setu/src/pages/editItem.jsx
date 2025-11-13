import { useEffect } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PiGrainsDuotone } from "react-icons/pi";
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/farmerSlice';
import { ClipLoader } from 'react-spinners';

function EditItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.farmer)
    const { itemId } = useParams()
    const [currentItem, setCurrentItem] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0) // ✅ Added
    const [unit, setUnit] = useState("kg") // ✅ Added
    const [frontendImage, setFrontendImage] = useState("")
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("veg")
    const [loading, setLoading] = useState(false)
    
    const categories = ["Vegetables", "Fruits", "Dairy", "Grain", "Meat", "others"]
    const units = ["kg", "g", "l", "ml", "piece", "dozen", "quintal"] // ✅ Added
    
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!name || !category || !price || !quantity) {
            alert('Please fill all required fields')
            return
        }
        
        setLoading(true)
        
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            formData.append("quantity", quantity) // ✅ Added
            formData.append("unit", unit) // ✅ Added
            
            if (backendImage) {
                formData.append("image", backendImage)
            }
            
            console.log('📤 Updating item...')
            
            const result = await axios.post(
                `${serverUrl}/api/item/edit-item/${itemId}`, 
                formData, 
                { withCredentials: true }
            )
            
            console.log('✅ Item updated:', result.data)
            
            dispatch(setMyShopData(result.data))
            alert('Item updated successfully! 🎉')
            navigate("/")
            
        } catch (error) {
            console.error('❌ Error:', error)
            alert(error.response?.data?.message || 'Failed to update item')
        } finally {
            setLoading(false)
        }
    }

    // Fetch item data on mount
    useEffect(() => {
        const handleGetItemById = async () => {
            try {
                console.log('📥 Fetching item:', itemId)
                const result = await axios.get(
                    `${serverUrl}/api/item/get-by-id/${itemId}`,
                    { withCredentials: true }
                )
                console.log('✅ Item fetched:', result.data)
                setCurrentItem(result.data)
            } catch (error) {
                console.error('❌ Error fetching item:', error)
                alert('Failed to load item')
            }
        }
        handleGetItemById()
    }, [itemId])

    // Populate form when currentItem loads
    useEffect(() => {
        if (currentItem) {
            setName(currentItem.name || "")
            setPrice(currentItem.price || 0)
            setQuantity(currentItem.quantity || 0) // ✅ Added
            setUnit(currentItem.unit || "kg") // ✅ Added
            setCategory(currentItem.category || "")
            setFoodType(currentItem.foodType || "veg")
            setFrontendImage(currentItem.image || "")
        }
    }, [currentItem])

    return (
        <div className='flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-5 left-5 z-10 mb-2.5 cursor-pointer' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>

            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <PiGrainsDuotone className='text-[#ff4d2d] w-16 h-16' />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">
                        Edit Food Item
                    </div>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter Item Name' 
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input 
                            type="file" 
                            accept='image/*' 
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' 
                            onChange={handleImage} 
                        />
                        {frontendImage && (
                            <div className='mt-4'>
                                <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border' />
                            </div>
                        )}
                    </div>

                    {/* Price and Quantity - Side by Side */}
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

                    {/* Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Select Category <span className="text-red-500">*</span>
                        </label>
                        <select 
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}
                        </select>
                    </div>

                    {/* Food Type */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                        <select 
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            onChange={(e) => setFoodType(e.target.value)}
                            value={foodType}
                        >
                            <option value="veg">Veg</option>
                            <option value="non veg">Non Veg</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button 
                        className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? <ClipLoader size={20} color='white' /> : "Update Item"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditItem
