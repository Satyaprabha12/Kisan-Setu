import { createSlice } from "@reduxjs/toolkit";

const farmerSlice = createSlice({
    name: "farmer",
    initialState: {
        myShopData:null,
        myShopOrders: [],
        newOrdersCount:0,
    },
    reducers:{
        setMyShopData:(state,action)=>{
         state.myShopData=action.payload
        },
        setMyShopOrders: (state, action) => {
      state.myShopOrders = action.payload;
    },
    setNewOrdersCount: (state, action) => {
      state.newOrdersCount = action.payload
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myShopOrders.find(o => o._id === orderId);
      if (order && order.shopOrders.shop._id === shopId) {
        order.shopOrders.status = status;
      }
    },
    }

})

export const {setMyShopData, setMyShopOrders, updateOrderStatus, setNewOrdersCount }=farmerSlice.actions
export default farmerSlice.reducer