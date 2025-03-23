import UserModel from '../models/user.js';
import bcrypt from 'bcrypt';

// Register User
const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existUser = await UserModel.findOne({ email })
        if (existUser) {
            return res.status(301).json({ success: false, message: "User Already Exist Please Login" })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({
            username: username,
            email: email,
            password: hashPassword,
            // profile: imagePath,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Error during registration', error);
        res.status(500).json({ error: 'Error during registration' });
    }
}

// Login User
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existUser = await UserModel.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        res.send(`Welcome!! ${existUser.username}`);
    }
    catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ error: 'Error during login' });
    }
}

export default { Register, Login };