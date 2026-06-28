import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, login, logout, signup, updateUser } from "../controllers/userController.js";
import path from "path";

const userRouter = express.Router();
const upload = multer({
    storage,
    limits: {
        fileSize: 7 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

const upload = multer({ storage });


userRouter.post('/signup', upload.single("profilePic"), signup)
userRouter.post('/login', login)
userRouter.post('/logout', protectRoute, logout);
userRouter.put('/update-profile', protectRoute, upload.single("profilePic"), updateUser)
userRouter.get('/check', protectRoute, checkAuth)

export default userRouter;