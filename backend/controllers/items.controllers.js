import { uploadToCloudinary } from "../utils/cloudinary.js"
import Shop from "../models/shop.model.js"
import Item from "../models/items.model.js"

export const addItem = async (req, res) => {
    try {
        console.log('📥 Add Item Request')
        console.log('Body:', req.body)

        const { name, category, price, quantity, unit, foodType } = req.body

        if (!name || !category || !price || quantity === undefined) {
            return res.status(400).json({
                message: "Name, category, price, and quantity are required"
            })
        }

        let image = null

        if (req.file) {
            console.log('📸 Uploading image...')
            image = await uploadToCloudinary(req.file.path)
            console.log('✅ Image uploaded')
        }

        const shop = await Shop.findOne({ owner: req.userId })

        if (!shop) {
            console.log('❌ Shop not found')
            return res.status(404).json({ message: "Shop not found for the user" })
        }

        console.log('✅ Shop found:', shop._id)

        const item = await Item.create({
            name,
            category,
            foodType: foodType || 'veg',
            price: Number(price),
            quantity: Number(quantity),
            unit: unit || 'kg',
            image,
            shop: shop._id
        })

        console.log('✅ Item created:', item._id)

        shop.items.push(item._id)
        await shop.save()

        console.log('✅ Item added to shop')

        const updatedShop = await Shop.findById(shop._id)
            .populate('owner')
            .populate({
                path: 'items',
                options: { sort: { createdAt: -1 } }
            })

        console.log('✅ Returning updated shop with', updatedShop.items.length, 'items')


        return res.status(201).json(updatedShop)

    } catch (error) {
        console.error('❌ Add Item Error:', error)
        return res.status(500).json({ message: error.message })
    }
}

export const editItem = async (req, res) => {
    try {
        console.log('Edit Item Request')
        console.log('Item ID:', req.params.itemId)
        console.log('Body:', req.body)

        const { itemId } = req.params
        const { name, category, price, quantity, unit, foodType } = req.body

        let image

        if (req.file) {
            console.log('Uploading new image...')
            image = await uploadToCloudinary(req.file.path)
            console.log('Image uploaded')
        }

        const updateData = {
            name,
            category,
            foodType,
            price: Number(price),
            quantity: Number(quantity),
            unit: unit || 'kg'
        }

        if (image) {
            updateData.image = image
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true }
        )

        if (!item) {
            console.log('❌ Item not found')
            return res.status(404).json({ message: "Item not found" })
        }

        console.log('✅ Item updated:', item._id)


        const shop = await Shop.findById(item.shop)
            .populate('owner')
            .populate({
                path: 'items',
                options: { sort: { createdAt: -1 } }
            })

        console.log('✅ Returning updated shop')

        return res.status(200).json(shop)

    } catch (error) {
        console.error('❌ Edit Item Error:', error)
        return res.status(500).json({ message: error.message })
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `get item error ${error}` })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        const shop = await Shop.findOne({ owner: req.userId })
        shop.items = shop.items.filter(i => i !== item._id)
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `delete item error ${error}` })
    }
}

export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "city is required" })
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopIds = shops.map((shop) => shop._id)

        const items = await Item.find({ shop: { $in: shopIds } })
        return res.status(200).json(items)

    } catch (error) {
        return res.status(500).json({ message: `get item by city error ${error}` })
    }
}

export const getItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params
        const shop = await Shop.findById(shopId).populate("items")
        if (!shop) {
            return res.status(400).json("shop not found")
        }
        return res.status(200).json({
            shop, items: shop.items
        })
    } catch (error) {
        return res.status(500).json({ message: `get item by shop error ${error}` })
    }
}

export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query
        if (!query || !city) {
            return null
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopIds = shops.map(s => s._id)
        const items = await Item.find({
            shop: { $in: shopIds },
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]

        }).populate("shop", "name image")

        return res.status(200).json(items)

    } catch (error) {
        return res.status(500).json({ message: `search item  error ${error}` })
    }
}

