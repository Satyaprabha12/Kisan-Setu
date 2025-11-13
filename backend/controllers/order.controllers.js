import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.models.js"
import RazorPay from "razorpay"
import dotenv from "dotenv"

dotenv.config()

let instance = null

const getRazorpayInstance = () => {
    console.log('🔍 Checking Razorpay Keys...');
    console.log('RAZORPAY_KEY_ID:', process.env.VITE_RAZORPAY_KEY_ID ? '✅ Found' : '❌ Missing');
    console.log('RAZORPAY_KEY_SECRET:', process.env.VITE_RAZORPAY_KEY_SECRET ? '✅ Found' : '❌ Missing');
    
    if (!instance) {
        if (!process.env.VITE_RAZORPAY_KEY_ID || !process.env.VITE_RAZORPAY_KEY_SECRET) {
            console.error('❌ ERROR: Razorpay keys not configured!');
            throw new Error('Razorpay keys not configured in .env file');
        }
        
        console.log('✅ Initializing Razorpay with keys...');
        instance = new RazorPay({
            key_id: process.env.VITE_RAZORPAY_KEY_ID,
            key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
        });
    }
    return instance;
}


export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body
        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({ message: "cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "send complete deliveryAddress" })
        }

        const groupItemsByShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                return res.status(400).json({ message: "shop not found" })
            }
            const items = groupItemsByShop[shopId]
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            }
        }
        ))

        if (paymentMethod == "online") {
             try {
        const razorpayInstance = getRazorpayInstance();
        const razorOrder = await razorpayInstance.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        })

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
            razorpayOrderId: razorOrder.id,
            payment: false
        })

        return res.status(200).json({
            razorOrder,
            orderId: newOrder._id,
        })

    } catch (razorpayError) {
        console.error('❌ Razorpay Error:', razorpayError.message);
        return res.status(500).json({ 
            message: `Razorpay error: ${razorpayError.message}` 
        })
    }
}

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        await newOrder.populate("shopOrders.owner", "name socketId")
        await newOrder.populate("user", "name email mobile")

        const io = req.app.get('io')

        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId
                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress,
                        payment: newOrder.payment
                    })
                }
            });
        }



        return res.status(201).json(newOrder)
    } catch (error) {
        return res.status(500).json({ message: `place order error ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body
        const razorpayInstance = getRazorpayInstance()
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id)

        if (!payment || payment.status != "captured") {
            return res.status(400).json({ message: "payment not captured" })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await order.populate("shopOrders.shopOrderItems.item", "name image price unit")
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.owner", "name socketId")
        await order.populate("user", "name email mobile")

        const io = req.app.get('io')

        if (io) {
            order.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId
                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment
                    })
                }
            });
        }


        return res.status(200).json(order)

    } catch (error) {
        return res.status(500).json({ message: `verify payment  error ${error}` })
    }
}



export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price unit")

            return res.status(200).json(orders)
        } else if (user.role == "farmer" || user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price unit")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")



            const filteredOrders = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            })))


            return res.status(200).json(filteredOrders)
        }

    } catch (error) {
        return res.status(500).json({ message: `get User order error ${error}` })
    }
}



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId)
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop._id.toString() === shopId
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;

    let availableBoys = [];
    if (status === "out of delivery") {
      availableBoys = await User.find({ role: "deliveryBoy", isAvailable: true })
        .select("fullName mobile");
    }

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      updatedStatus: shopOrder.status,
      availableBoys,
    });
  } catch (error) {
    return res.status(500).json({ message: `update status error: ${error}` });
  }
};




