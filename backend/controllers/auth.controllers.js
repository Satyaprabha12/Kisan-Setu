import User from "../models/user.models.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, contactNumber, role } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        if (contactNumber.length < 10) {
            return res.status(400).json({ message: "Contact number must be at least 10 digits long" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            contactNumber,
            role
        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json({ user, token })


    } catch (error) {
        return res.status(500).json({ message: "SignUp error", error: error.message })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
              secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json({ user })


    } catch (error) {
        return res.status(500).json({ message: "SignIn error" })
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", {
  secure: true,
  sameSite: "none",
  httpOnly: true
})
        return res.status(200).json({ message: "Log Outt successful" })
    } catch (error) {
        return res.status(500).json({ message: "SignOut error" })
    }
}
