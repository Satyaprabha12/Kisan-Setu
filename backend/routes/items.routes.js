import e from "express"
import isAuth from "../middleware/isauth.js"
import { addItem, deleteItem, editItem, getItemByCity, getItemById, getItemsByShop, searchItems } from "../controllers/items.controllers.js"
import { upload } from "../middleware/multer.js"


const itemRouter = e.Router()

itemRouter.post("/add-item",isAuth,upload.single("image"),addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)
itemRouter.get("/get-by-id/:itemId",isAuth,getItemById)
itemRouter.get("/delete/:itemId",isAuth,deleteItem)
itemRouter.get("/get-by-city/:city",isAuth,getItemByCity)
itemRouter.get("/get-by-shop/:shopId",isAuth,getItemsByShop)
itemRouter.get("/search-items",isAuth,searchItems)


export default itemRouter