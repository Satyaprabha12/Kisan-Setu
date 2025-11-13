import dotenv from "dotenv";
dotenv.config();

console.log('Environment loaded:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅' : '❌');
console.log('NODE_ENV:', process.env.NODE_ENV);
import e from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/items.routes.js";
import cors from "cors";
import orderRouter from "./routes/order.routes.js";

const app = e();

const PORT = process.env.PORT || 8000
app.use(e.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

app.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`)
});

