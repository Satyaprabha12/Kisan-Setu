import User from "../models/user.models.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "User ID not found" })
        }
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user data" })
    }
}