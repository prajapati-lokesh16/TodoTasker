import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGO_CONNECTION);
import user from "./models/user.js";
import login from "./models/login.js";
import task from './models/task.js';
import rateLimit from 'express-rate-limit';


const corsOptions = {
    origin: process.env.EXPRESS_TO_NEXT_CONNECTION_URL,
    credentials: true
};

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
        remainingTime: "15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many login attempts. Please try again after 15 minutes.",
            remainingTime: "15 minutes"
        });
    }
});

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());


const Authenticator = async (req, res, next) => {
    const token = req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied.Please Log in' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.cookie('jwtToken','', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path:'/',
            maxAge:0
        });
        return res.status(403).json({ message: "Session expired or Invalid token." });
    }
};


//Login Handler
app.post("/login",authLimiter, async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const User = await user.findOne({ email });
        if (!User) {
            return res.status(401).json({ 
                success: false,
                message: "The email or password you entered is incorrect",
                field: "email"
            });
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            await login.create({
                userId: User._id,
                success: false
            });
            return res.status(401).json({ 
                success: false,
                message: "The email or password you entered is incorrect",
                field: "password",
                attemptsRemaining: req.rateLimit ? req.rateLimit.remaining : undefined
            });
        }
        else {
            await login.create({
                userId: User._id,
                success: true
            })

            let token = jwt.sign({ email: User.email }, process.env.JWT_SECRET,{expiresIn:'1h'});
            res.cookie("jwtToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 3600000
            });
            return res.status(200).json({ success: true, message: "Login successful" });
        }
    }
    catch (error) {
        console.error("Login error: ", error);
        return res.status(500).json({ success: false, message: "An error occurred during login. Please try again later." });
    }
})


// Signup Validator
const checkEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is required",
                field: "email"
            });
        }

        const unique = await user.findOne({ email });

        if (unique) {
            return res.status(409).json({ 
                success: false, 
                message: "This email is already registered. Please try logging in or use a different email.",
                field: "email"
            });
        } else {
            next();
        }
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while checking email. Please try again." 
        });
    }
}

// Signup Handler 

app.post("/signup", checkEmailExists, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        
        const requiredFields = { firstName, lastName, email, password };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value || typeof value !== 'string' || !value.trim()) {
                return res.status(400).json({ 
                    success: false, 
                    message: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
                    field: field
                });
            }
        }

        const passSalt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, passSalt);
        
        await user.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: hash
        });

        return res.status(201).json({ 
            success: true,
            message: "Your account has been created successfully! Please login to continue."
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred during registration. Please try again later."
        });
    }
})

//Logout
app.post('/logout', Authenticator, async (req, res) => {
    try {
        const cookieoptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            expires: new Date(0),
            maxAge: 0  
        }
        res.clearCookie("jwtToken", cookieoptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ errors: error });
    }
})


//task adder
app.post('/addTasks', Authenticator, async (req, res) => {
    try {
        const info = req.user;
        const { taskName, taskDesc } = req.body;

       
        if (!taskName || taskName.trim() === '') {
            return res.status(400).json({ 
                message: "Task name is required", 
                success: false 
            });
        }

        const User = await user.findOne({ email: info.email });
        if (!User) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        const newTask = await task.create({
            userId: User._id,
            name: taskName.trim(),
            description: taskDesc ? taskDesc.trim() : ''
        });

        return res.status(201).json({ 
            message: "Task added successfully", 
            success: true, 
            task: newTask 
        });
    } catch (error) {
        console.error("Task creation error:", error);
        return res.status(500).json({ 
            message: "An error occurred while adding the task", 
            success: false 
        });
    }
})

app.get("/fetchTasks", Authenticator, async (req, res) => {
    try {
        const u = req.user;
        const User = await user.findOne({ email: u.email });
        const arr = await task.find({ userId: User._id });
        return res.status(200).json(arr);
    } catch (error) {
        return res.status(403).json({ errors: error });
    }
})

app.get("/fetchProfile", Authenticator, async (req, res) => {
    try {
        const u = req.user;
        const User = await user.findOne({ email: u.email });
        const arr = { email: User.email, firstname: User.firstName, lastname: User.lastName };
        return res.status(200).json(arr);
    } catch (error) {
        return res.status(403).json({ errors: error });
    }
})

app.delete("/deleteTasks", Authenticator, async (req, res) => {

    const id = req.body.ids;
    if (!id || !Array.isArray(id) || id.length === 0) {
        return res.status(400).json({ message: 'No task provided to delete' });
    }
    try {
        const result = await task.deleteMany({ _id: { $in: id } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No matching tasks found to delete' });
        }
        return res.status(200).json({ message: `${result.deletedCount} tasks deleted successfully`, success: true })
    } catch (error) {
        console.log("Database deletion error", error);
        return res.status(500).json({ message: "server error during batch deletion." });
    }
});

app.put('/toggleTasks', Authenticator, async (req, res) => {
    try {
        const id = req.body.id;
        const status = req.body.status;
        
        if (!id) {
            return res.status(400).json({ message: 'Task ID is required', success: false });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Status must be a boolean value', success: false });
        }

        const update = await task.updateOne(
            { _id: id }, 
            { $set: { isComplete: !status } }
        );

        if (update.matchedCount === 0) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }

        if (update.modifiedCount === 0) {
            return res.status(400).json({ message: 'Task status was not changed', success: false });
        }

        return res.status(200).json({ 
            message: 'Task status updated successfully', 
            success: true,
            newStatus: !status 
        });
    } catch (error) {
        console.error("Task toggle error:", error);
        return res.status(500).json({ 
            message: "An error occurred while updating the task status",
            success: false 
        });
    }
})

app.put('/changePassword', Authenticator, async (req, res) => {
    try {
        const User = req.user.email;
        if (!User) {
            return res.status(400).json({ message: 'Please Login first!', success: false });
        }
        const dbPass = await user.findOne({email:User});
        const password = await bcrypt.compare(req.body.oldpassword,dbPass.password);

        if (!password) {
            return res.status(400).json({ message: 'Please enter a valid Password', success: false });
        }
        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(req.body.password,salt);

        const update = await user.updateOne(
            { email: User }, 
            { $set: { password: newPass } }
        );

        if (update.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        if (update.modifiedCount === 0) {
            return res.status(400).json({ message: 'Password is not changed', success: false });
        }

        return res.status(200).json({ 
            message: 'Task status updated successfully', 
            success: true,
        });
    } catch (error) {
        console.error("Password updating error:", error);
        return res.status(500).json({ 
            message: "An error occurred while updating the Password",
            success: false 
        });
    }
})


app.put('/changeProfile', Authenticator, async (req, res) => {
    try {
        const User = req.user.email;
        if (!User) {
            return res.status(400).json({ message: 'Please Login first!', success: false });
        }
        
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const update = await user.updateOne(
            { email: User }, 
            { $set: { firstName:firstName,lastName:lastName } }
        );

        if (update.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        if (update.modifiedCount === 0) {
            return res.status(400).json({ message: 'Profile is not changed', success: false });
        }

        return res.status(200).json({ 
            message: 'Task status updated successfully', 
            success: true,
        });
    } catch (error) {
        console.error("Profile Updating error:", error);
        return res.status(500).json({ 
            message: "An error occurred while updating the Profile",
            success: false 
        });
    }
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`App is running at port ${port}`);
})