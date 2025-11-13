import e from "express";
import isAuth from "../middleware/isauth.js"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js"
import { upload } from "../middleware/multer.js"


const shopRouter = e.Router()

shopRouter.post("/create-edit", isAuth,upload.single("image"),createEditShop)
shopRouter.get("/my-shop", isAuth, getMyShop)
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity)


export default shopRouter