import express from "express"
import isAuth from "../middleware/isauth.js"
import { getMyOrders,  placeOrder,  updateOrderStatus,  verifyPayment, getNewOrdersCount} from "../controllers/order.controllers.js"


const orderRouter=express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.post("/verify-payment",isAuth,verifyPayment)
orderRouter.get("/my-orders",isAuth,getMyOrders)
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRouter.get("/farmer/new-orders-count", isAuth, getNewOrdersCount)


export default orderRouter