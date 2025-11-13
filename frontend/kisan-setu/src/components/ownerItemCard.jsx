import axios from 'axios';
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/farmerSlice';

function OwnerItemCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleDelete = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
            dispatch(setMyShopData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl hover:scale-105'>
            <div className='w-36 shrink-0 bg-gray-50'>
                <img src={data.image} alt={data.name} className='w-full h-full object-cover' />
            </div>
            
            <div className='flex flex-col justify-between p-3 flex-1'>
                <div>
                    <h2 className='text-base font-semibold text-[#ff4d2d] mb-1'>{data.name}</h2>
                    
                    <p className='text-sm text-gray-600 mb-0.5'>
                        <span className='font-medium text-gray-700'>Category:</span> {data.category}
                    </p>
                    
                    <p className='text-sm text-gray-600 mb-0.5'>
                        <span className='font-medium text-gray-700'>Food Type:</span> {data.foodType}
                    </p>
                    
                    {/* ✅ Added Quantity */}
                    <p className='text-sm text-gray-600'>
                        <span className='font-medium text-gray-700'>Stock:</span> {data.quantity} {data.unit}
                    </p>
                </div>
                
                <div className='flex items-center justify-between mt-2'>
                    <div className='text-[#ff4d2d] font-bold text-lg'>₹{data.price}</div>
                    
                    <div className='flex items-center gap-2'>
                        <div 
                            className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] transition-colors' 
                            onClick={() => navigate(`/edit-item/${data._id}`)}
                            title="Edit item"
                        >
                            <FaPen size={16} />
                        </div>
                        
                        <div 
                            className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] transition-colors' 
                            onClick={handleDelete}
                            title="Delete item"
                        >
                            <FaTrashAlt size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerItemCard
