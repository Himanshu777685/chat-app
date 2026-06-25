import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, login, logout, signup, updateUser } from "../controllers/userController.js";
import path from "path";

const userRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // .png .jpg etc
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });


userRouter.post('/signup', upload.single("profilePic"), signup)
userRouter.post('/login', login)
userRouter.post('/logout', logout);
userRouter.put('/update-profile', protectRoute, upload.single("profilePic"), updateUser)
userRouter.get('/check', protectRoute, checkAuth)

export default userRouter;