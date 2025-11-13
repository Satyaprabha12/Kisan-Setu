import Shop from "../models/shop.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"

export const createEditShop = async (req, res) => {
    try {
        console.log('Create/Edit Shop Request')
        console.log('Body:', req.body)
        console.log('File:', req.file)
        console.log('User ID:', req.userId)

        const { name, city, state, address } = req.body


        if (!name || !city || !state || !address) {
            return res.status(400).json({
                message: 'All fields (name, city, state, address) are required'
            })
        }

        let image = null


        if (req.file) {
            console.log('📸 Uploading image to Cloudinary...')
            try {
                image = await uploadToCloudinary(req.file.path)
                console.log('✅ Image uploaded:', image)
            } catch (uploadError) {
                console.error('❌ Cloudinary upload error:', uploadError)
                return res.status(500).json({
                    message: 'Failed to upload image'
                })
            }
        }

        let shop = await Shop.findOne({ owner: req.userId })

        if (!shop) {
            console.log('Creating new shop...')
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId
            })
            console.log('✅ New shop created:', shop._id)
        } else {

            console.log('Updating existing shop:', shop._id)


            const updateData = {
                name,
                city,
                state,
                address
            }

            if (image) {
                updateData.image = image
            }

            shop = await Shop.findByIdAndUpdate(
                shop._id,
                updateData,
                { new: true }
            )
            console.log('✅ Shop updated')
        }


        await shop.populate("owner")


        if (shop.items && shop.items.length > 0) {
            await shop.populate("items", "name price unit image category foodType")
        }

        console.log('✅ Shop operation successful')
        return res.status(201).json(shop)

    } catch (error) {
        console.error('❌ Create/Edit Shop Error:', error)
        return res.status(500).json({
            message: `Create shop error: ${error.message}`,
            error: error.toString()
        })
    }
}

export const getMyShop = async (req, res) => {
    try {
        console.log('📥 Get My Shop Request')
        console.log('User ID:', req.userId)

        const shop = await Shop.findOne({ owner: req.userId })
            .populate("owner")
            .populate({
                path: "items",
                options: { sort: { updatedAt: -1 } }
            })

        if (!shop) {
            console.log('⚠️ No shop found for user:', req.userId)
            return res.status(404).json({
                message: 'Shop not found',
                shop: null
            })
        }

        console.log('✅ Shop found:', shop._id)
        return res.status(200).json(shop)

    } catch (error) {
        console.error('❌ Get My Shop Error:', error)
        return res.status(500).json({
            message: `Get my shop error: ${error.message}`
        })
    }
}
export const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        return res.status(200).json(shops)
    } catch (error) {
        return res.status(500).json({ message: `get shop by city error ${error}` })
    }
}
